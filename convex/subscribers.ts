import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { requireAdmin, requireGroupRole } from "./lib/access";
import {
  GROUP_NAMES,
  GROUP_SLUGS,
  JOINABLE_GROUPS,
  vGroup,
  vLanguage,
  type GroupSlug,
} from "./lib/groups";
import {
  emailFrom,
  emailReady,
  emailReplyTo,
  renderEmail,
  unsubscribeHeaders,
} from "./lib/emailTemplate";
import { resend } from "./email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanGroups(groups: GroupSlug[]) {
  return [...new Set(groups)].filter((g) => JOINABLE_GROUPS.includes(g));
}

async function groupsOf(ctx: MutationCtx, subscriberId: Id<"subscribers">) {
  const rows = await ctx.db
    .query("subscriptions")
    .withIndex("by_subscriber", (q) => q.eq("subscriberId", subscriberId))
    .collect();
  return rows;
}

/** Make the subscriber's lists exactly `groups`. */
async function setGroups(
  ctx: MutationCtx,
  subscriberId: Id<"subscribers">,
  groups: GroupSlug[],
) {
  const rows = await groupsOf(ctx, subscriberId);
  for (const r of rows) {
    if (!groups.includes(r.group)) await ctx.db.delete(r._id);
  }
  const have = new Set(rows.map((r) => r.group));
  for (const group of groups) {
    if (!have.has(group)) {
      await ctx.db.insert("subscriptions", { subscriberId, group });
    }
  }
}

async function sendWelcome(
  ctx: MutationCtx,
  sub: Doc<"subscribers">,
  added: GroupSlug[],
) {
  if (!emailReady()) {
    console.log(`Email not configured; skipped welcome to ${sub.email}`);
    return;
  }
  const spanish = sub.language === "es";
  const names = added.map((g) => GROUP_NAMES[g]).join(", ");
  const { html, text } = renderEmail({
    heading: spanish ? "Ya está en la lista" : "You're on the list",
    body: spanish
      ? `Hola ${sub.name},\n\nGracias por unirse. Recibirá noticias de: ${names}.\n\nPuede cambiar sus listas o darse de baja en cualquier momento con los enlaces de abajo.`
      : `Hi ${sub.name},\n\nThanks for joining. You'll hear from: ${names}.\n\nYou can change your lists or unsubscribe any time with the links below.`,
    footer: spanish
      ? "Recibe esto porque se inscribió en sennparents.com."
      : "You're getting this because you signed up on sennparents.com.",
    token: sub.token,
    spanish,
  });
  await resend.sendEmail(ctx, {
    from: emailFrom(),
    to: sub.email,
    replyTo: [emailReplyTo()],
    subject: spanish
      ? "Bienvenido a Senn Parents"
      : "Welcome to Senn Parents",
    html,
    text,
    headers: unsubscribeHeaders(sub.token),
  });
}

/**
 * The homepage join form. Signing up again with the same email adds the
 * new groups to the existing record instead of making a duplicate.
 */
export const subscribe = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    grade: v.optional(v.string()),
    language: vLanguage,
    groups: v.array(vGroup),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const name = args.name.trim();
    const groups = cleanGroups(args.groups);
    if (!name || name.length > 120) throw new ConvexError("Enter your name");
    if (!EMAIL_RE.test(email) || email.length > 254) {
      throw new ConvexError("Enter a valid email");
    }
    if (groups.length === 0) throw new ConvexError("Choose at least one group");
    const grade = args.grade?.trim().slice(0, 40) || undefined;

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    let sub: Doc<"subscribers">;
    let added: GroupSlug[];
    if (existing === null) {
      const id = await ctx.db.insert("subscribers", {
        email,
        name,
        grade,
        language: args.language,
        token: crypto.randomUUID(),
        status: "active",
      });
      await setGroups(ctx, id, groups);
      sub = (await ctx.db.get(id))!;
      added = groups;
    } else {
      const current = (await groupsOf(ctx, existing._id)).map((r) => r.group);
      const keep = existing.status === "active" ? current : [];
      added = groups.filter((g) => !keep.includes(g));
      await setGroups(ctx, existing._id, [...new Set([...keep, ...groups])]);
      await ctx.db.patch(existing._id, {
        name,
        grade: grade ?? existing.grade,
        language: args.language,
        status: "active",
      });
      sub = (await ctx.db.get(existing._id))!;
    }

    if (added.length > 0) await sendWelcome(ctx, sub, added);
    return null;
  },
});

const vPrefs = v.object({
  name: v.string(),
  email: v.string(),
  language: vLanguage,
  status: v.union(v.literal("active"), v.literal("unsubscribed")),
  groups: v.array(vGroup),
});

/** What the preferences page shows. The token is the only credential. */
export const byToken = query({
  args: { token: v.string() },
  returns: v.union(v.null(), vPrefs),
  handler: async (ctx, { token }) => {
    const sub = await ctx.db
      .query("subscribers")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (sub === null) return null;
    const rows = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscriber", (q) => q.eq("subscriberId", sub._id))
      .collect();
    return {
      name: sub.name,
      email: sub.email,
      language: sub.language,
      status: sub.status,
      groups: rows.map((r) => r.group),
    };
  },
});

async function findByToken(ctx: MutationCtx, token: string) {
  const sub = await ctx.db
    .query("subscribers")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (sub === null) throw new ConvexError("That link isn't valid anymore");
  return sub;
}

export const updatePreferences = mutation({
  args: { token: v.string(), groups: v.array(vGroup), language: vLanguage },
  returns: v.null(),
  handler: async (ctx, { token, groups, language }) => {
    const sub = await findByToken(ctx, token);
    const clean = cleanGroups(groups);
    await setGroups(ctx, sub._id, clean);
    await ctx.db.patch(sub._id, {
      language,
      status: clean.length ? "active" : "unsubscribed",
    });
    return null;
  },
});

async function unsubscribe(ctx: MutationCtx, token: string) {
  const sub = await findByToken(ctx, token);
  await setGroups(ctx, sub._id, []);
  await ctx.db.patch(sub._id, { status: "unsubscribed" });
}

export const unsubscribeAll = mutation({
  args: { token: v.string() },
  returns: v.null(),
  handler: async (ctx, { token }) => {
    await unsubscribe(ctx, token);
    return null;
  },
});

/** One-click unsubscribe from the email client (see convex/http.ts). */
export const unsubscribeByToken = internalMutation({
  args: { token: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { token }) => {
    try {
      await unsubscribe(ctx, token);
      return true;
    } catch {
      return false;
    }
  },
});

/** Everyone on a group's list. Leads and admins only, since it's contact info. */
export const listForGroup = query({
  args: { group: vGroup },
  returns: v.array(
    v.object({
      _id: v.id("subscribers"),
      name: v.string(),
      email: v.string(),
      grade: v.optional(v.string()),
      language: vLanguage,
      joined: v.number(),
    }),
  ),
  handler: async (ctx, { group }) => {
    await requireGroupRole(ctx, group, "lead");
    const rows = await ctx.db
      .query("subscriptions")
      .withIndex("by_group", (q) => q.eq("group", group))
      .order("desc")
      .take(5000);
    const out = [];
    for (const r of rows) {
      const s = await ctx.db.get(r.subscriberId);
      if (s === null || s.status !== "active") continue;
      out.push({
        _id: s._id,
        name: s.name,
        email: s.email,
        grade: s.grade,
        language: s.language,
        joined: r._creationTime,
      });
    }
    return out;
  },
});

/** How many people are on a group's list. Any editor can see this. */
export const countForGroup = query({
  args: { group: vGroup },
  returns: v.number(),
  handler: async (ctx, { group }) => {
    await requireGroupRole(ctx, group, "editor");
    const rows = await ctx.db
      .query("subscriptions")
      .withIndex("by_group", (q) => q.eq("group", group))
      .take(5000);
    return rows.length;
  },
});

/** List sizes for every group, for the admin reports page. */
export const countsAll = query({
  args: {},
  returns: v.object({
    total: v.number(),
    byGroup: v.array(v.object({ group: vGroup, count: v.number() })),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const byGroup = [];
    for (const group of GROUP_SLUGS) {
      const rows = await ctx.db
        .query("subscriptions")
        .withIndex("by_group", (q) => q.eq("group", group))
        .take(5000);
      byGroup.push({ group, count: rows.length });
    }
    const subs = await ctx.db.query("subscribers").take(10000);
    return {
      total: subs.filter((s) => s.status === "active").length,
      byGroup,
    };
  },
});
