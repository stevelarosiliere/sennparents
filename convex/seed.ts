import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { GroupSlug } from "./lib/groups";
import { SAMPLE_ANNOUNCEMENTS, SAMPLE_EVENTS } from "./lib/sampleData";
import { PAC_MEETINGS } from "../lib/pac-meetings";

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

/**
 * Post the 2026-27 PAC meeting schedule (lib/pac-meetings.ts) as PAC
 * events. Safe on prod: skips any date that already has a PAC event.
 * Run with: npx convex run seed:pacMeetings [--prod]
 */
export const pacMeetings = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
    if (admin === null) return "Create an admin account first.";

    let added = 0;
    for (const m of PAC_MEETINGS) {
      const existing = await ctx.db
        .query("events")
        .withIndex("by_group_date", (q) => q.eq("group", "pac").eq("date", m.date))
        .first();
      if (existing !== null) continue;
      await ctx.db.insert("events", {
        group: "pac",
        cohosts: [],
        title: "PAC Meeting",
        date: m.date,
        time: "7:00 PM",
        ends: "8:00 PM",
        tags: ["meeting"],
        place: { kind: "senn", name: m.location ?? "Senn High School" },
        body: "All parents and guardians are welcome. You do not need to be a member to attend. Location and join link are shared the week before on the Senn events page (sennhs.org/apps/events).",
        rsvp: false,
        published: true,
        createdBy: admin._id,
      });
      added++;
    }
    return `Added ${added} PAC meetings.`;
  },
});
