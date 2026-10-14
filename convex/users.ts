import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";

const roleValidator = v.union(
  v.literal("pending"),
  v.literal("staff"),
  v.literal("admin"),
  v.literal("denied"),
);

/** Throw unless the caller is a signed-in admin. Returns the admin's row. */
async function requireAdmin(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) throw new Error("Not signed in");
  const caller = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();
  if (caller === null || caller.role !== "admin") {
    throw new Error("Admin only");
  }
  return caller;
}

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
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();
  },
});

/**
 * Create the user's row on first sign-in (role starts as "pending").
 * On later calls, just keeps email/name in sync — never touches role,
 * which admins change by hand in the Convex dashboard for now.
 */
export const ensure = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not signed in");

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

/** Accounts awaiting approval, oldest first. Admin only. */
export const listPending = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const pending = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "pending"))
      .collect();
    return pending.map((u) => ({
      _id: u._id,
      _creationTime: u._creationTime,
      email: u.email,
      name: u.name,
    }));
  },
});

/** Approve a pending account as staff. Admin only. */
export const approve = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    await requireAdmin(ctx);
    const target = await ctx.db.get(userId);
    if (target === null) throw new Error("User not found");
    if (target.role !== "pending") throw new Error("User is not pending");
    await ctx.db.patch(userId, { role: "staff" });
    return null;
  },
});

/** Deny a pending account. Admin only. */
export const deny = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    await requireAdmin(ctx);
    const target = await ctx.db.get(userId);
    if (target === null) throw new Error("User not found");
    if (target.role !== "pending") throw new Error("User is not pending");
    await ctx.db.patch(userId, { role: "denied" });
    return null;
  },
});
