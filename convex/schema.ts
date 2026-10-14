import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user ID (the JWT subject)
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.union(
      v.literal("pending"),
      v.literal("staff"),
      v.literal("admin"),
      v.literal("denied"),
    ),
  })
    .index("by_externalId", ["externalId"])
    .index("by_role", ["role"]),
});
