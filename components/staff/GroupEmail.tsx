"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { groupFull, type GroupSlug } from "@/lib/umbrella-data";
import { errorText } from "@/lib/errors";

type Audience = "all" | "en" | "es";

const AUDIENCE_LABEL: Record<Audience, string> = {
  all: "Everyone",
  en: "Everyone except Spanish speakers",
  es: "Spanish speakers only",
};

export default function GroupEmail({
  group,
  myEmail,
}: {
  group: GroupSlug;
  myEmail?: string;
}) {
  const status = useQuery(api.email.status);
  const count = useQuery(api.subscribers.countForGroup, { group });
  const sends = useQuery(api.email.listSends, { group });
  const send = useMutation(api.email.sendGroupEmail);
  const sendTest = useMutation(api.email.sendTest);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [testTo, setTestTo] = useState(myEmail ?? "");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    setError("");
    setOk("");
    try {
      await fn();
      setOk(done);
      return true;
    } catch (err) {
      setError(errorText(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const sendAll = async () => {
    const sent = await run(
      () => send({ group, subject, body, audience }),
      "Sent. It goes out over the next few minutes.",
    );
    setConfirming(false);
    if (sent) {
      setSubject("");
      setBody("");
    }
  };

  return (
    <>
      {status && !status.ready ? (
        <div className="dash-note">
          Email isn&apos;t switched on yet. A site admin needs to add the Resend
          API key before anything can be sent.
        </div>
      ) : null}

      <div className="dash-card dash-form">
        <h3 className="full" style={{ marginBottom: "0.25rem" }}>
          Email the {groupFull(group)} list
        </h3>
        <p className="full" style={{ color: "var(--ink-60)", marginBottom: "1rem" }}>
          {count === undefined
            ? "Counting the list…"
            : `${count} ${count === 1 ? "person is" : "people are"} on this list. Every email includes an unsubscribe link.`}
        </p>
        <label className="f full">
          <span className="lbl">Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="f full">
          <span className="lbl">Message</span>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={"Plain text. Leave a blank line between paragraphs.\nLinks are fine, paste the full https:// address."}
          />
        </label>
        <label className="f">
          <span className="lbl">Send to</span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
          >
            {(Object.keys(AUDIENCE_LABEL) as Audience[]).map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABEL[a]}
              </option>
            ))}
          </select>
        </label>
        <label className="f">
          <span className="lbl">Test address</span>
          <input
            type="email"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="you@email.com"
          />
        </label>

        {error ? <p className="form-error full">{error}</p> : null}
        {ok ? <p className="form-ok full">{ok}</p> : null}

        <div className="dash-form-foot">
          <button
            className="dash-btn dash-btn-quiet"
            disabled={busy || !testTo}
            onClick={() =>
              void run(
                () => sendTest({ group, subject, body, to: testTo }),
                `Test sent to ${testTo}.`,
              )
            }
          >
            Send me a test
          </button>
          {confirming ? (
            <>
              <button className="dash-btn" disabled={busy} onClick={() => void sendAll()}>
                Yes, send to {AUDIENCE_LABEL[audience].toLowerCase()}
              </button>
              <button
                className="dash-btn dash-btn-quiet"
                onClick={() => setConfirming(false)}
              >
                Wait
              </button>
            </>
          ) : (
            <button
              className="dash-btn"
              disabled={busy || !subject.trim() || !body.trim() || !count}
              onClick={() => setConfirming(true)}
            >
              Send to the list
            </button>
          )}
        </div>
      </div>

      <div className="dash-section">
        <h3>Sent</h3>
        <div className="dash-card dash-scroll">
          {sends === undefined ? (
            <p>Loading…</p>
          ) : sends.length === 0 ? (
            <p>Nothing sent yet.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Subject</th>
                  <th>To</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {sends.map((s) => (
                  <tr key={s._id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(s._creationTime).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{s.subject}</td>
                    <td>
                      {s.queued} {s.queued === 1 ? "person" : "people"}
                      {s.done ? "" : " so far"}
                    </td>
                    <td>{s.sentByName ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
