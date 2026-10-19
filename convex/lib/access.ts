import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import type { GroupRole, GroupSlug } from "./groups";

/** The caller's users row, or null if signed out / no row yet. */
export async function getCaller(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();
}

/** Throw unless the caller is a signed-in, approved account. */
export async function requireApproved(ctx: QueryCtx) {
  const caller = await getCaller(ctx);
  if (caller === null) throw new ConvexError("Not signed in");
  if (caller.role !== "staff" && caller.role !== "admin") {
    throw new ConvexError("Account not approved");
  }
  return caller;
}

/** Throw unless the caller is a site admin. Returns the admin's row. */
export async function requireAdmin(ctx: QueryCtx) {
  const caller = await requireApproved(ctx);
  if (caller.role !== "admin") throw new ConvexError("Admin only");
  return caller;
}

/** A user's role in one group, or null. Admins aren't special-cased here. */
export async function roleInGroup(
  ctx: QueryCtx,
  userId: Doc<"users">["_id"],
  group: GroupSlug,
): Promise<GroupRole | null> {
  const row = await ctx.db
    .query("groupRoles")
    .withIndex("by_user_group", (q) => q.eq("userId", userId).eq("group", group))
    .unique();
  return row?.role ?? null;
}

/**
 * Throw unless the caller can act for this group. Editors can post
 * content; leads can also email the list and manage volunteers.
 * Site admins pass every check.
 */
export async function requireGroupRole(
  ctx: QueryCtx,
  group: GroupSlug,
  min: GroupRole,
) {
  const caller = await requireApproved(ctx);
  if (caller.role === "admin") return caller;
  const role = await roleInGroup(ctx, caller._id, group);
  if (role === null || (min === "lead" && role !== "lead")) {
    throw new ConvexError(
      min === "lead" ? "Group leads only" : "You don't have access to this group",
    );
  }
  return caller;
}
