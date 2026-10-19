import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireGroupRole } from "./lib/access";
import { vGroup, vPlace, vSlot, vTag } from "./lib/groups";

/* The shape the homepage and group pages render (SennEvent). */
const vPublicEvent = v.object({
  id: v.string(),
  groups: v.array(vGroup),
  title: v.string(),
  date: v.string(),
  time: v.string(),
  ends: v.optional(v.string()),
  tags: v.array(vTag),
  place: vPlace,
  body: v.string(),
  rsvp: v.boolean(),
  slots: v.optional(v.array(vSlot)),
});

function toPublic(e: Doc<"events">) {
  return {
    id: e._id,
    groups: [e.group, ...e.cohosts.filter((g) => g !== e.group)],
    title: e.title,
    date: e.date,
    time: e.time,
    ends: e.ends,
    tags: e.tags,
    place: e.place,
    body: e.body,
    rsvp: e.rsvp,
    slots: e.slots,
  };
}

/** Published events on or after `from` (YYYY-MM-DD), soonest first. */
export const listUpcoming = query({
  args: { from: v.string() },
  returns: v.array(vPublicEvent),
  handler: async (ctx, { from }) => {
    const rows = await ctx.db
      .query("events")
      .withIndex("by_published_date", (q) =>
        q.eq("published", true).gte("date", from),
      )
      .take(100);
    return rows.map(toPublic);
  },
});

const eventFields = {
  cohosts: v.array(vGroup),
  title: v.string(),
  date: v.string(),
  time: v.string(),
  ends: v.optional(v.string()),
  tags: v.array(vTag),
  place: vPlace,
  body: v.string(),
  rsvp: v.boolean(),
  published: v.boolean(),
};

const vEventDoc = v.object({
  _id: v.id("events"),
  _creationTime: v.number(),
  group: vGroup,
  ...eventFields,
  slots: v.optional(v.array(vSlot)),
  createdBy: v.id("users"),
});

/** Every event a group owns, drafts and past ones included, newest first. */
export const listForGroup = query({
  args: { group: vGroup },
  returns: v.array(vEventDoc),
  handler: async (ctx, { group }) => {
    await requireGroupRole(ctx, group, "editor");
    return await ctx.db
      .query("events")
      .withIndex("by_group_date", (q) => q.eq("group", group))
      .order("desc")
      .take(200);
  },
});

function check(fields: { title: string; date: string; time: string }) {
  if (!fields.title.trim()) throw new ConvexError("Give the event a title");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) throw new ConvexError("Pick a date");
  if (!fields.time.trim()) throw new ConvexError("Pick a start time");
}

export const create = mutation({
  args: { group: vGroup, ...eventFields },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    const caller = await requireGroupRole(ctx, args.group, "editor");
    check(args);
    // Only site admins can list other groups as cohosts.
    return await ctx.db.insert("events", {
      ...args,
      cohosts:
        caller.role === "admin"
          ? args.cohosts.filter((g) => g !== args.group)
          : [],
      createdBy: caller._id,
    });
  },
});

export const update = mutation({
  args: { id: v.id("events"), ...eventFields },
  returns: v.null(),
  handler: async (ctx, { id, ...fields }) => {
    const existing = await ctx.db.get(id);
    if (existing === null) throw new ConvexError("Event not found");
    const caller = await requireGroupRole(ctx, existing.group, "editor");
    check(fields);
    // Non-admins keep whatever cohosts an admin already set.
    await ctx.db.patch(id, {
      ...fields,
      cohosts:
        caller.role === "admin"
          ? fields.cohosts.filter((g) => g !== existing.group)
          : existing.cohosts,
    });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id);
    if (existing === null) return null;
    await requireGroupRole(ctx, existing.group, "editor");
    await ctx.db.delete(id);
    return null;
  },
});
