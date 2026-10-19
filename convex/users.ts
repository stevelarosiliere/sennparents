import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  getCaller,
  requireAdmin,
  requireApproved,
  requireGroupRole,
  roleInGroup,
} from "./lib/access";
import { GROUP_SLUGS, vGroup, vGroupRole } from "./lib/groups";

const roleValidator = v.union(
  v.literal("pending"),
  v.literal("staff"),
  v.literal("admin"),
  v.literal("denied"),
);

/** The signed-in user's row, or null if signed out / not yet created. */
export const current = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      externalId: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      role: roleValidator,
      requestedGroup: v.optional(vGroup),
    }),
  ),
  handler: async (ctx) => {
    return await getCaller(ctx);
  },
});

/**
 * Create the user's row on first sign-in (role starts as "pending").
 * On later calls, just keeps email/name in sync — never touches role.
 */
export const ensure = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Not signed in");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (existing !== null) {
      if (
        existing.email !== identity.email ||
        existing.name !== identity.name
      ) {
        await ctx.db.patch(existing._id, {
          email: identity.email,
          name: identity.name,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      externalId: identity.subject,
      email: identity.email,
      name: identity.name,
      role: "pending",
    });
  },
});

/**
 * What the caller can do: site admin or not, and their role in each group.
 * Admins get every group as lead.
 */
export const myAccess = query({
  args: {},
  returns: v.object({
    isAdmin: v.boolean(),
    groups: v.array(v.object({ group: vGroup, role: vGroupRole })),
  }),
  handler: async (ctx) => {
    const caller = await requireApproved(ctx);
    if (caller.role === "admin") {
      return {
        isAdmin: true,
        groups: GROUP_SLUGS.map((group) => ({ group, role: "lead" as const })),
      };
    }
    const rows = await ctx.db
      .query("groupRoles")
      .withIndex("by_user", (q) => q.eq("userId", caller._id))
      .collect();
    return {
      isAdmin: false,
      groups: rows.map((r) => ({ group: r.group, role: r.role })),
    };
  },
});

/** Ask to help with a group. A lead of that group or an admin approves. */
export const requestGroup = mutation({
  args: { group: vGroup },
  returns: v.null(),
  handler: async (ctx, { group }) => {
    const caller = await getCaller(ctx);
    if (caller === null) throw new ConvexError("Not signed in");
    if (caller.role === "denied") throw new ConvexError("Account not approved");
    if (caller.role === "admin") throw new ConvexError("Admins already have access");
    if ((await roleInGroup(ctx, caller._id, group)) !== null) {
      throw new ConvexError("You're already on this group");
    }
    await ctx.db.patch(caller._id, { requestedGroup: group });
    return null;
  },
});

const requestRow = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  email: v.optional(v.string()),
  name: v.optional(v.string()),
  role: roleValidator,
  requestedGroup: v.optional(vGroup),
});

/**
 * Access requests the caller can act on, oldest first. Admins see every
 * pending account plus every group request; leads see requests for the
 * groups they lead.
 */
export const listRequests = query({
  args: {},
  returns: v.array(requestRow),
  handler: async (ctx) => {
    const caller = await requireApproved(ctx);
    const toRow = (u: Doc<"users">) => ({
      _id: u._id,
      _creationTime: u._creationTime,
      email: u.email,
      name: u.name,
      role: u.role,
      requestedGroup: u.requestedGroup,
    });
    let rows: Doc<"users">[];

    if (caller.role === "admin") {
      const pending = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", "pending"))
        .collect();
      const requesting = [];
      for (const group of GROUP_SLUGS) {
        requesting.push(
          ...(await ctx.db
            .query("users")
            .withIndex("by_requestedGroup", (q) => q.eq("requestedGroup", group))
            .collect()),
        );
      }
      const seen = new Set(pending.map((u) => u._id));
      rows = [...pending, ...requesting.filter((u) => !seen.has(u._id))];
    } else {
      const led = await ctx.db
        .query("groupRoles")
        .withIndex("by_user", (q) => q.eq("userId", caller._id))
        .collect();
      rows = [];
      for (const r of led.filter((r) => r.role === "lead")) {
        rows.push(
          ...(await ctx.db
            .query("users")
            .withIndex("by_requestedGroup", (q) =>
              q.eq("requestedGroup", r.group),
            )
            .collect()),
        );
      }
    }

    return rows
      .filter((u) => u.role !== "denied")
      .sort((a, b) => a._creationTime - b._creationTime)
      .map(toRow);
  },
});

/**
 * Approve someone onto a group. Leads can add editors to their own group;
 * admins can add anyone to any group as lead or editor.
 */
export const approve = mutation({
  args: { userId: v.id("users"), group: vGroup, role: vGroupRole },
  returns: v.null(),
  handler: async (ctx, { userId, group, role }) => {
    const caller = await requireGroupRole(ctx, group, "lead");
    if (role === "lead" && caller.role !== "admin") {
      throw new ConvexError("Only admins can add group leads");
    }
    const target = await ctx.db.get(userId);
    if (target === null) throw new ConvexError("User not found");
    if (caller.role !== "admin" && target.requestedGroup !== group) {
      throw new ConvexError("This person didn't ask to join your group");
    }

    const existing = await ctx.db
      .query("groupRoles")
      .withIndex("by_user_group", (q) => q.eq("userId", userId).eq("group", group))
      .unique();
    if (existing === null) {
      await ctx.db.insert("groupRoles", { userId, group, role });
    } else if (existing.role !== role) {
      await ctx.db.patch(existing._id, { role });
    }

    await ctx.db.patch(userId, {
      role: target.role === "admin" ? "admin" : "staff",
      requestedGroup: undefined,
    });
    return null;
  },
});

/**
 * Turn down a request. A brand-new account is marked denied; an approved
 * account just has its request cleared.
 */
export const deny = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const caller = await requireApproved(ctx);
    const target = await ctx.db.get(userId);
    if (target === null) throw new ConvexError("User not found");

    if (caller.role !== "admin") {
      if (target.requestedGroup === undefined) throw new ConvexError("Admin only");
      await requireGroupRole(ctx, target.requestedGroup, "lead");
    }

    await ctx.db.patch(userId, {
      role: target.role === "pending" ? "denied" : target.role,
      requestedGroup: undefined,
    });
    return null;
  },
});

/** Everyone with an account and their group roles. Admin only. */
export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      role: roleValidator,
      groups: v.array(v.object({ group: vGroup, role: vGroupRole })),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    // Volunteer accounts number in the dozens, so one bounded read is fine
    const users = await ctx.db.query("users").take(1000);
    const roles = await ctx.db.query("groupRoles").take(5000);
    return users.map((u) => ({
      _id: u._id,
      _creationTime: u._creationTime,
      email: u.email,
      name: u.name,
      role: u.role,
      groups: roles
        .filter((r) => r.userId === u._id)
        .map((r) => ({ group: r.group, role: r.role })),
    }));
  },
});

/** Leads and editors on one group. Lead or admin only. */
export const team = query({
  args: { group: vGroup },
  returns: v.array(
    v.object({
      userId: v.id("users"),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      role: vGroupRole,
    }),
  ),
  handler: async (ctx, { group }) => {
    await requireGroupRole(ctx, group, "lead");
    const rows = await ctx.db
      .query("groupRoles")
      .withIndex("by_group", (q) => q.eq("group", group))
      .collect();
    const out = [];
    for (const r of rows) {
      const u = await ctx.db.get(r.userId);
      if (u === null) continue;
      out.push({ userId: u._id, email: u.email, name: u.name, role: r.role });
    }
    return out.sort((a, b) =>
      a.role === b.role ? 0 : a.role === "lead" ? -1 : 1,
    );
  },
});

/**
 * Change or remove someone's role in a group (role: null removes them).
 * Admins can do anything. Leads can only remove editors from their own
 * group.
 */
export const setGroupRole = mutation({
  args: {
    userId: v.id("users"),
    group: vGroup,
    role: v.union(v.null(), vGroupRole),
  },
  returns: v.null(),
  handler: async (ctx, { userId, group, role }) => {
    const caller = await requireGroupRole(ctx, group, "lead");
    const target = await ctx.db.get(userId);
    if (target === null) throw new ConvexError("User not found");
    if (target.role === "pending" || target.role === "denied") {
      throw new ConvexError("Approve this account first");
    }

    const existing = await ctx.db
      .query("groupRoles")
      .withIndex("by_user_group", (q) => q.eq("userId", userId).eq("group", group))
      .unique();

    if (caller.role !== "admin") {
      if (role !== null) throw new ConvexError("Admin only");
      if (existing?.role !== "editor") {
        throw new ConvexError("Leads can only remove editors");
      }
    }

    if (role === null) {
      if (existing !== null) await ctx.db.delete(existing._id);
    } else if (existing === null) {
      await ctx.db.insert("groupRoles", { userId, group, role });
    } else if (existing.role !== role) {
      await ctx.db.patch(existing._id, { role });
    }
    return null;
  },
});
