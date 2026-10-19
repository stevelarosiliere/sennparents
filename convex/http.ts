import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { resend } from "./email";

const http = httpRouter();

/* RFC 8058 one-click unsubscribe. Mail clients POST here when a parent
   hits the Unsubscribe button next to the sender name. */
http.route({
  path: "/unsubscribe",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const token = new URL(req.url).searchParams.get("token");
    if (!token) return new Response("Missing token", { status: 400 });
    const ok = await ctx.runMutation(internal.subscribers.unsubscribeByToken, {
      token,
    });
    return new Response(ok ? "Unsubscribed" : "Unknown token", {
      status: ok ? 200 : 404,
    });
  }),
});

/* Delivery, bounce, and complaint events from Resend. Needs
   RESEND_WEBHOOK_SECRET set on the deployment. */
http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});

export default http;
