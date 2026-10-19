/* Plain, readable HTML for group emails. Senders write plain text; blank
   lines become paragraphs and single newlines become line breaks. */

export function siteUrl() {
  return (process.env.SITE_URL ?? "https://sennparents.com").replace(/\/$/, "");
}

export function emailFrom() {
  return process.env.EMAIL_FROM ?? "Senn Parents <hello@sennparents.com>";
}

export function emailReplyTo() {
  return process.env.EMAIL_REPLY_TO ?? "sennparents@gmail.com";
}

/** True once RESEND_API_KEY is set on the deployment. */
export function emailReady() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function preferencesUrl(token: string) {
  return `${siteUrl()}/preferences?token=${encodeURIComponent(token)}`;
}

/** Headers that give Gmail and Yahoo their one-click unsubscribe button. */
export function unsubscribeHeaders(token: string) {
  const site = process.env.CONVEX_SITE_URL;
  const links = [`<${preferencesUrl(token)}&action=unsubscribe>`];
  if (site) {
    links.unshift(`<${site}/unsubscribe?token=${encodeURIComponent(token)}>`);
  }
  return [
    { name: "List-Unsubscribe", value: links.join(", ") },
    ...(site
      ? [{ name: "List-Unsubscribe-Post", value: "List-Unsubscribe=One-Click" }]
      : []),
  ];
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(text: string) {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

export function renderEmail({
  heading,
  body,
  footer,
  token,
  spanish,
}: {
  heading: string;
  body: string;
  footer: string;
  token: string;
  spanish: boolean;
}) {
  const prefs = preferencesUrl(token);
  const manage = spanish ? "Cambiar mis listas" : "Change my lists";
  const unsub = spanish ? "Darme de baja" : "Unsubscribe";

  const html = `<!doctype html>
<html><body style="margin:0;background:#F6F3EC;font-family:Helvetica,Arial,sans-serif;color:#16211A">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1B5E20">Senn Parents</p>
  <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3">${escapeHtml(heading)}</h1>
  <div style="font-size:16px;line-height:1.55">${paragraphs(body)}</div>
  <hr style="border:none;border-top:1px solid #DDD6C8;margin:28px 0 16px">
  <p style="margin:0;font-size:13px;line-height:1.5;color:#5B6660">${escapeHtml(footer)}<br>
  <a href="${prefs}" style="color:#1B5E20">${manage}</a> &middot;
  <a href="${prefs}&action=unsubscribe" style="color:#1B5E20">${unsub}</a></p>
</div>
</body></html>`;

  const text = `${heading}\n\n${body.trim()}\n\n--\n${footer}\n${manage}: ${prefs}\n${unsub}: ${prefs}&action=unsubscribe\n`;

  return { html, text };
}
