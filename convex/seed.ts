import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { GroupSlug } from "./lib/groups";
import { SAMPLE_ANNOUNCEMENTS, SAMPLE_EVENTS } from "./lib/sampleData";

type Tag = "meeting" | "volunteer" | "fundraiser" | "social" | "training";

function shift(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Fill an empty dev deployment with the mockup's sample events and
 * announcements, moved forward so the first event is a week out.
 * Run with: npx convex run seed:sampleContent
 * Never run this against prod.
 */
export const sampleContent = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    if ((await ctx.db.query("events").first()) !== null) {
      return "Events already exist; nothing seeded.";
    }
    const admin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
    if (admin === null) return "Create an admin account first.";

    const today = new Date().toISOString().slice(0, 10);
    const first = SAMPLE_EVENTS.map((e) => e.date).sort()[0];
    const offset = Math.round(
      (Date.parse(shift(today, 7)) - Date.parse(first)) / 86_400_000,
    );

    for (const e of SAMPLE_EVENTS) {
      const [group, ...cohosts] = e.groups as GroupSlug[];
      await ctx.db.insert("events", {
        group,
        cohosts,
        title: e.title,
        date: shift(e.date, offset),
        time: e.time,
        ends: e.ends,
        tags: e.tags as Tag[],
        place: e.place,
        body: e.body,
        rsvp: e.rsvp,
        slots: e.slots,
        published: true,
        createdBy: admin._id,
      });
    }
    for (const a of SAMPLE_ANNOUNCEMENTS) {
      await ctx.db.insert("announcements", {
        group: a.group as GroupSlug,
        title: a.title,
        body: a.body,
        date: shift(a.date, offset - 14),
        published: true,
        createdBy: admin._id,
      });
    }
    return `Seeded ${SAMPLE_EVENTS.length} events and ${SAMPLE_ANNOUNCEMENTS.length} announcements.`;
  },
});
