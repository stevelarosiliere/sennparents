import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  vGroup,
  vGroupRole,
  vLanguage,
  vPlace,
  vSlot,
  vTag,
} from "./lib/groups";

export default defineSchema({
  users: defineTable({
    // Clerk user ID (the JWT subject)
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    // "admin" is a site admin with access to every group. "staff" is any
    // approved account; what they can touch comes from groupRoles.
    role: v.union(
      v.literal("pending"),
      v.literal("staff"),
      v.literal("admin"),
      v.literal("denied"),
    ),
    // Group this person asked to help with, waiting on a lead or admin
    requestedGroup: v.optional(vGroup),
  })
    .index("by_externalId", ["externalId"])
    .index("by_role", ["role"])
    .index("by_requestedGroup", ["requestedGroup"]),

  // Leads run a group and approve its volunteers. Editors post content.
  groupRoles: defineTable({
    userId: v.id("users"),
    group: vGroup,
    role: vGroupRole,
  })
    .index("by_user", ["userId"])
    .index("by_group", ["group"])
    .index("by_user_group", ["userId", "group"]),

  events: defineTable({
    // Owning group decides who can edit. Cohosts only change where it shows.
    group: vGroup,
    cohosts: v.array(vGroup),
    title: v.string(),
    date: v.string(), // YYYY-MM-DD
    time: v.string(), // "7:00 PM"
    ends: v.optional(v.string()),
    tags: v.array(vTag),
    place: vPlace,
    body: v.string(),
    rsvp: v.boolean(),
    slots: v.optional(v.array(vSlot)),
    published: v.boolean(),
    createdBy: v.id("users"),
  })
    .index("by_published_date", ["published", "date"])
    .index("by_group_date", ["group", "date"]),

  announcements: defineTable({
    group: vGroup,
    title: v.string(),
    body: v.string(),
    date: v.string(), // YYYY-MM-DD
    published: v.boolean(),
    createdBy: v.id("users"),
  })
    .index("by_published_date", ["published", "date"])
    .index("by_group_published_date", ["group", "published", "date"])
    .index("by_group_date", ["group", "date"]),

  // Parents on the mailing lists. No account; the token is their key to
  // the preferences page and one-click unsubscribe.
  subscribers: defineTable({
    email: v.string(), // lowercased
    name: v.string(),
    grade: v.optional(v.string()),
    language: vLanguage,
    token: v.string(),
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  subscriptions: defineTable({
    subscriberId: v.id("subscribers"),
    group: vGroup,
  })
    .index("by_group", ["group"])
    .index("by_subscriber", ["subscriberId"])
    .index("by_subscriber_group", ["subscriberId", "group"]),

  emailSends: defineTable({
    group: vGroup,
    subject: v.string(),
    body: v.string(),
    audience: v.union(v.literal("all"), v.literal("en"), v.literal("es")),
    sentBy: v.id("users"),
    queued: v.number(),
    done: v.boolean(),
  }).index("by_group", ["group"]),
});
