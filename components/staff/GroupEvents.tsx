"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  GROUPS,
  TAGS,
  fmtDate,
  type GroupSlug,
} from "@/lib/umbrella-data";
import { chicagoToday, to12h, to24h } from "@/lib/time";
import { errorText } from "@/lib/errors";

type Tag = Doc<"events">["tags"][number];
type PlaceKind = Doc<"events">["place"]["kind"];

type Draft = {
  title: string;
  date: string;
  start: string;
  end: string;
  tags: Tag[];
  cohosts: GroupSlug[];
  placeKind: PlaceKind;
  placeName: string;
  room: string;
  address: string;
  virtual: string;
  body: string;
  rsvp: boolean;
  published: boolean;
};

const BLANK: Draft = {
  title: "",
  date: "",
  start: "",
  end: "",
  tags: [],
  cohosts: [],
  placeKind: "senn",
  placeName: "Senn High School",
  room: "",
  address: "",
  virtual: "",
  body: "",
  rsvp: false,
  published: true,
};

function fromDoc(e: Doc<"events">): Draft {
  return {
    title: e.title,
    date: e.date,
    start: to24h(e.time),
    end: e.ends ? to24h(e.ends) : "",
    tags: e.tags,
    cohosts: e.cohosts,
    placeKind: e.place.kind,
    placeName: e.place.name,
    room: e.place.room ?? "",
    address: e.place.address ?? "",
    virtual: e.place.virtual ?? "",
    body: e.body,
    rsvp: e.rsvp,
    published: e.published,
  };
}

function toArgs(d: Draft) {
  const opt = (s: string) => (s.trim() ? s.trim() : undefined);
  return {
    title: d.title.trim(),
    date: d.date,
    time: d.start ? to12h(d.start) : "",
    ends: d.end ? to12h(d.end) : undefined,
    tags: d.tags,
    cohosts: d.cohosts,
    place: {
      kind: d.placeKind,
      name: d.placeName.trim() || (d.placeKind === "virtual" ? "Online" : "Senn High School"),
      room: d.placeKind === "senn" ? opt(d.room) : undefined,
      address: d.placeKind === "offsite" ? opt(d.address) : undefined,
      virtual: d.placeKind === "offsite" ? undefined : opt(d.virtual),
    },
    body: d.body.trim(),
    rsvp: d.rsvp,
    published: d.published,
  };
}

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function EventForm({
  group,
  isAdmin,
  editing,
  onDone,
}: {
  group: GroupSlug;
  isAdmin: boolean;
  editing: Doc<"events"> | null;
  onDone: () => void;
}) {
  const create = useMutation(api.events.create);
  const update = useMutation(api.events.update);
  const [d, setD] = useState<Draft>(editing ? fromDoc(editing) : BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof Draft>(k: K, value: Draft[K]) =>
    setD((prev) => ({ ...prev, [k]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editing) await update({ id: editing._id, ...toArgs(d) });
      else await create({ group, ...toArgs(d) });
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
        {editing ? "Edit event" : "New event"}
      </h3>
      <label className="f full">
        <span className="lbl">Title</span>
        <input
          required
          value={d.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="PAC Meeting: Budget Review"
        />
      </label>
      <label className="f">
        <span className="lbl">Date</span>
        <input
          type="date"
          required
          value={d.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </label>
      <div className="f-row">
        <label className="f">
          <span className="lbl">Starts</span>
          <input
            type="time"
            required
            value={d.start}
            onChange={(e) => set("start", e.target.value)}
          />
        </label>
        <label className="f">
          <span className="lbl">Ends</span>
          <input
            type="time"
            value={d.end}
            onChange={(e) => set("end", e.target.value)}
          />
        </label>
      </div>

      <div className="full">
        <span className="lbl">Type</span>
        <div className="chips">
          {Object.entries(TAGS).map(([key, t]) => (
            <label className="chip" key={key}>
              <input
                type="checkbox"
                checked={d.tags.includes(key as Tag)}
                onChange={() => set("tags", toggle(d.tags, key as Tag))}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <label className="f">
        <span className="lbl">Where</span>
        <select
          value={d.placeKind}
          onChange={(e) => {
            const kind = e.target.value as PlaceKind;
            setD((prev) => ({
              ...prev,
              placeKind: kind,
              placeName:
                kind === "senn" ? "Senn High School" : kind === "virtual" ? "Zoom" : "",
            }));
          }}
        >
          <option value="senn">At Senn</option>
          <option value="offsite">Somewhere else</option>
          <option value="virtual">Online only</option>
        </select>
      </label>
      <label className="f">
        <span className="lbl">
          {d.placeKind === "senn"
            ? "Place at Senn"
            : d.placeKind === "offsite"
              ? "Venue name"
              : "Platform"}
        </span>
        <input
          value={d.placeName}
          onChange={(e) => set("placeName", e.target.value)}
          placeholder={
            d.placeKind === "senn"
              ? "Senn Library"
              : d.placeKind === "offsite"
                ? "Little Red Nest"
                : "Zoom"
          }
        />
      </label>
      {d.placeKind === "senn" ? (
        <label className="f">
          <span className="lbl">Room (optional)</span>
          <input
            value={d.room}
            onChange={(e) => set("room", e.target.value)}
            placeholder="Second floor, room 210"
          />
        </label>
      ) : null}
      {d.placeKind === "offsite" ? (
        <label className="f full">
          <span className="lbl">Street address</span>
          <input
            required
            value={d.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="5717 N Clark St, Chicago IL 60660"
          />
        </label>
      ) : null}
      {d.placeKind !== "offsite" ? (
        <label className={d.placeKind === "senn" ? "f" : "f full"}>
          <span className="lbl">
            {d.placeKind === "virtual" ? "Meeting link" : "Video link, if hybrid"}
          </span>
          <input
            type="url"
            required={d.placeKind === "virtual"}
            value={d.virtual}
            onChange={(e) => set("virtual", e.target.value)}
            placeholder="https://meet.google.com/…"
          />
        </label>
      ) : null}

      <label className="f full">
        <span className="lbl">Details</span>
        <textarea
          rows={4}
          value={d.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="What happens, who should come, anything to bring."
        />
      </label>

      {isAdmin ? (
        <div className="full">
          <span className="lbl">Also hosted by (optional)</span>
          <div className="chips">
            {GROUPS.filter((g) => g.slug !== group).map((g) => (
              <label className="chip" key={g.slug}>
                <input
                  type="checkbox"
                  checked={d.cohosts.includes(g.slug)}
                  onChange={() => set("cohosts", toggle(d.cohosts, g.slug))}
                />
                {g.name}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <label className="check-line">
        <input
          type="checkbox"
          checked={d.rsvp}
          onChange={(e) => set("rsvp", e.target.checked)}
        />
        Show a sign-up button
      </label>
      <label className="check-line">
        <input
          type="checkbox"
          checked={d.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        Published (uncheck to save as a draft)
      </label>

      {error ? <p className="form-error full">{error}</p> : null}
      <div className="dash-form-foot">
        <button className="dash-btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : editing ? "Save changes" : "Post event"}
        </button>
        <button className="dash-btn dash-btn-quiet" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function GroupEvents({
  group,
  isAdmin,
}: {
  group: GroupSlug;
  isAdmin: boolean;
}) {
  const events = useQuery(api.events.listForGroup, { group });
  const remove = useMutation(api.events.remove);
  const [mode, setMode] = useState<"list" | "new" | Id<"events">>("list");
  const [confirmId, setConfirmId] = useState<Id<"events"> | null>(null);
  const today = chicagoToday();

  if (mode !== "list") {
    const editing =
      mode === "new" ? null : (events?.find((e) => e._id === mode) ?? null);
    return (
      <EventForm
        key={mode}
        group={group}
        isAdmin={isAdmin}
        editing={editing}
        onDone={() => setMode("list")}
      />
    );
  }

  return (
    <>
      <div className="dash-toolbar">
        <p>Published events show on the homepage calendar and this group&apos;s page.</p>
        <button className="dash-btn" onClick={() => setMode("new")}>
          + New event
        </button>
      </div>
      <div className="dash-card dash-scroll">
        {events === undefined ? (
          <p>Loading…</p>
        ) : events.length === 0 ? (
          <p>No events yet. Post the first one.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id}>
                  <td>
                    {fmtDate(e.date)}
                    <br />
                    <span style={{ color: "var(--ink-60)" }}>{e.time}</span>
                  </td>
                  <td>
                    <strong>{e.title}</strong>
                    <br />
                    <span style={{ color: "var(--ink-60)" }}>{e.place.name}</span>
                  </td>
                  <td>
                    {e.date < today ? (
                      <span className="status-pill past">Past</span>
                    ) : e.published ? (
                      <span className="status-pill">Live</span>
                    ) : (
                      <span className="status-pill draft">Draft</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      className="dash-btn dash-btn-quiet"
                      onClick={() => setMode(e._id)}
                    >
                      Edit
                    </button>
                    {confirmId === e._id ? (
                      <button
                        className="dash-btn dash-btn-danger"
                        onClick={() => {
                          setConfirmId(null);
                          void remove({ id: e._id });
                        }}
                      >
                        Confirm delete
                      </button>
                    ) : (
                      <button
                        className="dash-btn dash-btn-quiet"
                        onClick={() => setConfirmId(e._id)}
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
