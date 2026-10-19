import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireGroupRole } from "./lib/access";
import { vGroup } from "./lib/groups";

const vPublicAnnouncement = v.object({
  id: v.string(),
  group: vGroup,
  title: v.string(),
  body: v.string(),
  date: v.string(),
});

/** Latest published announcements across every group. */
export const listRecent = query({
  args: { limit: v.number() },
  returns: v.array(vPublicAnnouncement),
  handler: async (ctx, { limit }) => {
    const rows = await ctx.db
      .query("announcements")
      .withIndex("by_published_date", (q) => q.eq("published", true))
      .order("desc")
      .take(Math.min(limit, 50));
    return rows.map((a) => ({
      id: a._id,
      group: a.group,
      title: a.title,
      body: a.body,
      date: a.date,
    }));
  },
});

/** Latest published announcements for one group page. */
export const listPublishedForGroup = query({
  args: { group: vGroup },
  returns: v.array(vPublicAnnouncement),
  handler: async (ctx, { group }) => {
    const rows = await ctx.db
      .query("announcements")
      .withIndex("by_group_published_date", (q) =>
        q.eq("group", group).eq("published", true),
      )
      .order("desc")
      .take(20);
    return rows.map((a) => ({
      id: a._id,
      group: a.group,
      title: a.title,
      body: a.body,
      date: a.date,
    }));
  },
});

const fields = {
  title: v.string(),
  body: v.string(),
  date: v.string(),
  published: v.boolean(),
};

/** Every announcement a group has, drafts included. Editors and up. */
export const listForGroup = query({
  args: { group: vGroup },
  returns: v.array(
    v.object({
      _id: v.id("announcements"),
      _creationTime: v.number(),
      group: vGroup,
      ...fields,
      createdBy: v.id("users"),
    }),
  ),
  handler: async (ctx, { group }) => {
    await requireGroupRole(ctx, group, "editor");
    return await ctx.db
      .query("announcements")
      .withIndex("by_group_date", (q) => q.eq("group", group))
      .order("desc")
      .take(200);
  },
});

function check(a: { title: string; body: string; date: string }) {
  if (!a.title.trim()) throw new ConvexError("Give the announcement a title");
  if (!a.body.trim()) throw new ConvexError("Write something in the body");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date)) throw new ConvexError("Pick a date");
}

export const create = mutation({
  args: { group: vGroup, ...fields },
  returns: v.id("announcements"),
  handler: async (ctx, args) => {
    const caller = await requireGroupRole(ctx, args.group, "editor");
    check(args);
    return await ctx.db.insert("announcements", {
      ...args,
      createdBy: caller._id,
    });
  },
});

export const update = mutation({
  args: { id: v.id("announcements"), ...fields },
  returns: v.null(),
  handler: async (ctx, { id, ...rest }) => {
    const existing = await ctx.db.get(id);
    if (existing === null) throw new ConvexError("Announcement not found");
    await requireGroupRole(ctx, existing.group, "editor");
    check(rest);
    await ctx.db.patch(id, rest);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("announcements") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id);
    if (existing === null) return null;
    await requireGroupRole(ctx, existing.group, "editor");
    await ctx.db.delete(id);
    return null;
  },
});
