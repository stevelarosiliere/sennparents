import { Resend } from "@convex-dev/resend";
import { ConvexError, v } from "convex/values";
import { components, internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireGroupRole } from "./lib/access";
import { GROUP_NAMES, vGroup } from "./lib/groups";
import {
  emailFrom,
  emailReady,
  emailReplyTo,
  renderEmail,
  unsubscribeHeaders,
} from "./lib/emailTemplate";

/* Resend reads RESEND_API_KEY from the deployment env. testMode is off so
   real parents get mail; with no key set, the senders below refuse to
   queue anything. */
export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

const vAudience = v.union(v.literal("all"), v.literal("en"), v.literal("es"));
const BATCH = 100;

function checkMessage(subject: string, body: string) {
  if (!subject.trim()) throw new ConvexError("Add a subject");
  if (subject.length > 200) throw new ConvexError("Keep the subject under 200 characters");
  if (!body.trim()) throw new ConvexError("Write the message");
  if (body.length > 20000) throw new ConvexError("That message is too long");
}

function notReady(): never {
  throw new ConvexError(
    "Email isn't set up yet. An admin needs to add the Resend API key.",
  );
}

/** Email everyone on a group's list. Group leads and admins only. */
export const sendGroupEmail = mutation({
  args: {
    group: vGroup,
    subject: v.string(),
    body: v.string(),
    audience: vAudience,
  },
  returns: v.id("emailSends"),
  handler: async (ctx, { group, subject, body, audience }) => {
    const caller = await requireGroupRole(ctx, group, "lead");
    if (!emailReady()) notReady();
    checkMessage(subject, body);
    const sendId = await ctx.db.insert("emailSends", {
      group,
      subject: subject.trim(),
      body,
      audience,
      sentBy: caller._id,
      queued: 0,
      done: false,
    });
    await ctx.scheduler.runAfter(0, internal.email.deliverBatch, {
      sendId,
      cursor: null,
    });
    return sendId;
  },
});

/** Queue one page of a group send, then schedule the next page. */
export const deliverBatch = internalMutation({
  args: { sendId: v.id("emailSends"), cursor: v.union(v.string(), v.null()) },
  returns: v.null(),
  handler: async (ctx, { sendId, cursor }) => {
    const send = await ctx.db.get(sendId);
    if (send === null) return null;

    const page = await ctx.db
      .query("subscriptions")
      .withIndex("by_group", (q) => q.eq("group", send.group))
      .paginate({ numItems: BATCH, cursor });

    let queued = 0;
    for (const row of page.page) {
      const sub = await ctx.db.get(row.subscriberId);
      if (sub === null || sub.status !== "active") continue;
      if (send.audience === "es" && sub.language !== "es") continue;
      if (send.audience === "en" && sub.language === "es") continue;

      const spanish = sub.language === "es";
      const { html, text } = renderEmail({
        heading: send.subject,
        body: send.body,
        footer: spanish
          ? `Recibe esto porque está en la lista de ${GROUP_NAMES[send.group]} en sennparents.com.`
          : `You're getting this because you're on the ${GROUP_NAMES[send.group]} list at sennparents.com.`,
        token: sub.token,
        spanish,
      });
      await resend.sendEmail(ctx, {
        from: emailFrom(),
        to: sub.email,
        replyTo: [emailReplyTo()],
        subject: send.subject,
        html,
        text,
        headers: unsubscribeHeaders(sub.token),
        idempotencyKey: `${sendId}:${sub._id}`,
      });
      queued++;
    }

    await ctx.db.patch(sendId, {
      queued: send.queued + queued,
      done: page.isDone,
    });
    if (!page.isDone) {
      await ctx.scheduler.runAfter(0, internal.email.deliverBatch, {
        sendId,
        cursor: page.continueCursor,
      });
    }
    return null;
  },
});

/** Send a draft to one address so the lead can see it before the list does. */
export const sendTest = mutation({
  args: {
    group: vGroup,
    subject: v.string(),
    body: v.string(),
    to: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { group, subject, body, to }) => {
    await requireGroupRole(ctx, group, "lead");
    if (!emailReady()) notReady();
    checkMessage(subject, body);
    const address = to.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      throw new ConvexError("Enter a valid test address");
    }
    const { html, text } = renderEmail({
      heading: subject,
      body,
      footer: `Test send. Parents on the ${GROUP_NAMES[group]} list get their own unsubscribe links here.`,
      token: "test",
      spanish: false,
    });
    await resend.sendEmail(ctx, {
      from: emailFrom(),
      to: address,
      replyTo: [emailReplyTo()],
      subject: `[Test] ${subject.trim()}`,
      html,
      text,
    });
    return null;
  },
});

/** Recent sends for a group, newest first. */
export const listSends = query({
  args: { group: vGroup },
  returns: v.array(
    v.object({
      _id: v.id("emailSends"),
      _creationTime: v.number(),
      subject: v.string(),
      audience: vAudience,
      queued: v.number(),
      done: v.boolean(),
      sentByName: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, { group }) => {
    await requireGroupRole(ctx, group, "lead");
    const rows = await ctx.db
      .query("emailSends")
      .withIndex("by_group", (q) => q.eq("group", group))
      .order("desc")
      .take(20);
    const out = [];
    for (const s of rows) {
      const by = await ctx.db.get(s.sentBy);
      out.push({
        _id: s._id,
        _creationTime: s._creationTime,
        subject: s.subject,
        audience: s.audience,
        queued: s.queued,
        done: s.done,
        sentByName: by?.name ?? by?.email,
      });
    }
    return out;
  },
});

/** Whether the deployment has a Resend key, so the UI can say so. */
export const status = query({
  args: {},
  returns: v.object({ ready: v.boolean() }),
  handler: async () => ({ ready: emailReady() }),
});
