"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { fmtDate, type GroupSlug } from "@/lib/umbrella-data";
import { chicagoToday } from "@/lib/time";
import { errorText } from "@/lib/errors";

function AnnouncementForm({
  group,
  editing,
  onDone,
}: {
  group: GroupSlug;
  editing: Doc<"announcements"> | null;
  onDone: () => void;
}) {
  const create = useMutation(api.announcements.create);
  const update = useMutation(api.announcements.update);
  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [date, setDate] = useState(editing?.date ?? chicagoToday());
  const [published, setPublished] = useState(editing?.published ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fields = { title, body, date, published };
      if (editing) await update({ id: editing._id, ...fields });
      else await create({ group, ...fields });
      onDone();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="dash-card dash-form" onSubmit={save}>
      <h3 className="full" style={{ marginBottom: "1rem" }}>
        {editing ? "Edit announcement" : "New announcement"}
      </h3>
      <label className="f full">
        <span className="lbl">Headline</span>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="May minutes posted, laptop purchase approved"
        />
      </label>
      <label className="f full">
        <span className="lbl">What parents should know</span>
        <textarea
          required
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <label className="f">
        <span className="lbl">Date shown</span>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label className="check-line" style={{ alignSelf: "end" }}>
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published (uncheck to save as a draft)
      </label>
      {error ? <p className="form-error full">{error}</p> : null}
      <div className="dash-form-foot">
        <button className="dash-btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : editing ? "Save changes" : "Post announcement"}
        </button>
        <button className="dash-btn dash-btn-quiet" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function GroupAnnouncements({ group }: { group: GroupSlug }) {
  const rows = useQuery(api.announcements.listForGroup, { group });
  const remove = useMutation(api.announcements.remove);
  const [mode, setMode] = useState<"list" | "new" | Id<"announcements">>("list");
  const [confirmId, setConfirmId] = useState<Id<"announcements"> | null>(null);

  if (mode !== "list") {
    const editing =
      mode === "new" ? null : (rows?.find((a) => a._id === mode) ?? null);
    return (
      <AnnouncementForm
        key={mode}
        group={group}
        editing={editing}
        onDone={() => setMode("list")}
      />
    );
  }

  return (
    <>
      <div className="dash-toolbar">
        <p>The newest announcements show in &ldquo;What&apos;s new&rdquo; on the homepage.</p>
        <button className="dash-btn" onClick={() => setMode("new")}>
          + New announcement
        </button>
      </div>
      <div className="dash-card dash-scroll">
        {rows === undefined ? (
          <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p>Nothing posted yet.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Announcement</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a._id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(a.date)}</td>
                  <td>
                    <strong>{a.title}</strong>
                    <br />
                    <span style={{ color: "var(--ink-60)" }}>
                      {a.body.length > 120 ? `${a.body.slice(0, 120)}…` : a.body}
                    </span>
                  </td>
                  <td>
                    <span className={a.published ? "status-pill" : "status-pill draft"}>
                      {a.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="dash-btn dash-btn-quiet"
                      onClick={() => setMode(a._id)}
                    >
                      Edit
                    </button>
                    {confirmId === a._id ? (
                      <button
                        className="dash-btn dash-btn-danger"
                        onClick={() => {
                          setConfirmId(null);
                          void remove({ id: a._id });
                        }}
                      >
                        Confirm delete
                      </button>
                    ) : (
                      <button
                        className="dash-btn dash-btn-quiet"
                        onClick={() => setConfirmId(a._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
