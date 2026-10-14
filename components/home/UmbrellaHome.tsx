"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Shield from "@/components/Shield";
import UmbrellaFooter from "@/components/home/UmbrellaFooter";
import {
  ANNOUNCEMENTS,
  DONORS,
  EFFORTS,
  EVENTS,
  GROUPS,
  MONTHS,
  TAGS,
  TIERS,
  fmtDate,
  groupColor,
  groupFull,
  groupName,
  groupsInTier,
  joinableGroups,
  mapLink,
  openSlots,
  placeLine,
  type SennEvent,
} from "@/lib/umbrella-data";

const navLinks = [
  { href: "#groups", label: "Groups" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "#calendar", label: "Events" },
  { href: "#news", label: "News" },
  { href: "#join", label: "Join", pill: true },
];

const filterDefs = [
  { key: "all", label: "Everything", color: null as string | null },
  ...Object.entries(TAGS).map(([k, v]) => ({
    key: `tag:${k}`,
    label: v.label,
    color: v.color as string | null,
  })),
  ...GROUPS.map((g) => ({
    key: `group:${g.slug}`,
    label: g.name,
    color: g.color as string | null,
  })),
];

function eventDay(ev: SennEvent) {
  const [, m, d] = ev.date.split("-").map(Number);
  return { day: d, mon: MONTHS[m - 1] };
}

export default function UmbrellaHome() {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [sheetId, setSheetId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const sheetEvent = sheetId ? EVENTS.find((e) => e.id === sheetId) : undefined;

  useEffect(() => {
    document.body.style.overflow = sheetEvent ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetEvent]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Group pages link here as /?join=<slug>#join, prechecked for that group */
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("join");
    if (slug && joinableGroups().some((g) => g.slug === slug)) {
      setPicked((p) => (p.includes(slug) ? p : [...p, slug]));
    }
  }, []);

  const togglePicked = (slug: string) =>
    setPicked((p) =>
      p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]
    );

  const slide = (dir: number) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>(".upcard");
    if (!card) return;
    t.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const matches = (ev: SennEvent) => {
    if (filter === "all") return true;
    const [kind, val] = filter.split(":");
    return kind === "tag" ? ev.tags.includes(val) : ev.groups.includes(val);
  };
  const calRows = EVENTS.filter(matches);

  return (
    <>
      <Nav links={navLinks} brandHref="#top" />

      {/* Thin group rail, mobile */}
      <div className="rail">
        <div className="rail-scroll">
          {GROUPS.map((g) => (
            <a key={g.slug} href={`#g-${g.slug}`}>
              <span className="dot" style={{ background: g.color }}></span>
              {g.name}
            </a>
          ))}
        </div>
      </div>

      {/* Hero */}
      <header className="hero" id="top">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="https://d3id26kdqbehod.cloudfront.net/NICSHS/2025/11/18/FZj47wpVlGiXWQNp4yVTVFyh8ueE90fgdgpzn2tHVk4D5eRFByiktvlLYHCJ/Senn+Broll_Drone_Exterior-480p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-veil"></div>
        <div className="wrap hero-grid">
          <div className="hero-inner">
            <Shield
              className="hero-shield"
              outer="#D4A017"
              inner="#1B5E20"
              letter="#D4A017"
            />
            <h1>Senn Parents</h1>
            <p className="tagline">One high school. Every way to get involved.</p>
            <p className="hero-sub">
              Every parent group at Senn in one place, with one form that puts
              you on any list you want. You do not have to be a member to show
              up.
            </p>
            <div className="hero-actions">
              <a href="#join" className="btn btn-gold">
                Join a group <span className="arrow">&rarr;</span>
              </a>
              <a href="#groups" className="btn btn-line">
                See the groups
              </a>
            </div>
            <p style={{ marginTop: "1.5rem" }}>
              <span className="translate">
                <span aria-hidden="true">&#127760;</span>
                <label htmlFor="lang" className="sr-only">
                  Language
                </label>
                <select
                  id="lang"
                  defaultValue="English"
                  onChange={(e) => {
                    if (e.target.value === "Español") router.push("/es");
                  }}
                >
                  <option>English</option>
                  <option>Español</option>
                  <option>العربية</option>
                  <option>Українська</option>
                </select>
              </span>
            </p>
          </div>

          <aside className="next-up next-up--carousel">
            <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
              Next up
            </p>
            <div className="upnext">
              <div className="upnext-track" ref={trackRef}>
                {EVENTS.slice(0, 5).map((ev) => {
                  const { day, mon } = eventDay(ev);
                  return (
                    <button
                      key={ev.id}
                      className="upcard"
                      style={
                        { "--src": groupColor(ev.groups[0]) } as React.CSSProperties
                      }
                      onClick={() => setSheetId(ev.id)}
                    >
                      <div className="when-big">
                        <b>{day}</b>
                        <span>{mon}</span>
                      </div>
                      <h3>{ev.title}</h3>
                      <p className="where">
                        {ev.time} &middot; {placeLine(ev)}
                      </p>
                      <div className="tags">
                        {ev.tags.map((t) => (
                          <span key={t} className="tag-pill">
                            {TAGS[t].label}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="upnext-nav">
                <button
                  type="button"
                  aria-label="Previous event"
                  onClick={() => slide(-1)}
                >
                  &larr;
                </button>
                <button
                  type="button"
                  aria-label="Next event"
                  onClick={() => slide(1)}
                >
                  &rarr;
                </button>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* Groups, in three tiers */}
      <section id="groups">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Start here</p>
              <h2>Choose your volunteer path</h2>
              <p className="lede">
                Each group runs itself and sets its own agenda. Join as many as
                you like. Tap <b>Add me</b> and the signup further down fills
                itself in.
              </p>
            </div>
          </div>
          {TIERS.map((tier) => {
            const gs = groupsInTier(tier.slug);
            if (!gs.length) return null;
            return (
              <div className="tier" key={tier.slug}>
                <div className="tier-head">
                  <h3>{tier.name}</h3>
                  <p>{tier.blurb}</p>
                </div>
                <div className="ways">
                  {gs.map((g) => (
                    <div
                      key={g.slug}
                      className={g.infoOnly ? "way way--info" : "way"}
                      id={`g-${g.slug}`}
                      style={{ "--dest": g.color } as React.CSSProperties}
                    >
                      <span className="way-tag">
                        {g.parent
                          ? `Part of ${groupFull(g.parent)}`
                          : tier.name}
                      </span>
                      <h3>{g.full}</h3>
                      <p>{g.blurb}</p>
                      <div className="way-who">{g.who}</div>
                      <div className="way-foot">
                        <Link href={`/groups/${g.slug}`} className="way-go">
                          Open page <span className="arrow">&rarr;</span>
                        </Link>
                        {g.joinable ? (
                          <button
                            className="way-add"
                            aria-pressed={picked.includes(g.slug)}
                            onClick={() => togglePicked(g.slug)}
                          >
                            {picked.includes(g.slug) ? "✓ Added" : "+ Add me"}
                          </button>
                        ) : (
                          <span className="way-note">{g.infoNote}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Immediate asks */}
      <section id="volunteer" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="needs">
            <div className="sec-head">
              <div>
                <p className="eyebrow" style={{ color: "var(--green-mid)" }}>
                  Open asks
                </p>
                <h2>Where you&apos;re needed right now</h2>
                <p className="lede">Real jobs with real deadlines. Pick one.</p>
              </div>
            </div>
            <div className="need-grid">
              {EFFORTS.map((x) => (
                <div
                  key={x.title}
                  className="need"
                  style={{ "--src": groupColor(x.group) } as React.CSSProperties}
                >
                  <div className="need-main">
                    <span className="who">{groupName(x.group)}</span>
                    <h3>{x.title}</h3>
                    <p>{x.ask}</p>
                  </div>
                  <div className="need-by">
                    <span>By</span>
                    <b>{x.deadline}</b>
                  </div>
                  <a href="#" className="btn btn-quiet">
                    {x.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join */}
      <section id="join">
        <div className="wrap">
          <div className="join">
            <div className="join-grid">
              <div className="join-copy">
                <p className="eyebrow">One form, every list</p>
                <h2>Join in about a minute</h2>
                <p>
                  Fill this out once. You choose which groups email you, and
                  you can change it any time.
                </p>
                <p>
                  We never share your information. Every list can be read in
                  Spanish, and interpretation is standing at PAC and BAC
                  meetings.
                </p>
              </div>

              <div className="join-card">
                <div className="picked">
                  {picked.length
                    ? `You'll hear from ${picked
                        .map((s) => groupName(s))
                        .join(", ")}.`
                    : "No groups picked yet. Choose at least one."}
                </div>

                <span className="lbl">I want to hear from</span>
                <div className="chips">
                  {joinableGroups().map((g) => (
                    <label className="chip" key={g.slug}>
                      <input
                        type="checkbox"
                        value={g.slug}
                        checked={picked.includes(g.slug)}
                        onChange={() => togglePicked(g.slug)}
                      />
                      {g.name}
                    </label>
                  ))}
                </div>

                <div className="f-row">
                  <div className="f">
                    <span className="lbl">Your name</span>
                    <input type="text" placeholder="First and last" />
                  </div>
                  <div className="f">
                    <span className="lbl">Email</span>
                    <input type="email" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="f-row">
                  <div className="f">
                    <span className="lbl">Student grade</span>
                    <select defaultValue="Select">
                      <option>Select</option>
                      <option>9th</option>
                      <option>10th</option>
                      <option>11th</option>
                      <option>12th</option>
                      <option>Multiple</option>
                      <option>Incoming</option>
                    </select>
                  </div>
                  <div className="f">
                    <span className="lbl">Language</span>
                    <select defaultValue="English">
                      <option>English</option>
                      <option>Español</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <button
                  className="btn btn-green"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Sign me up
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="calendar" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Every group, one calendar</p>
              <h2>Everything coming up</h2>
              <p className="lede">
                Tap any event for the full details, the address, and the
                signup. Anyone can submit an event. It posts once a group admin
                approves it.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <a href="#" className="btn btn-quiet">
                Submit an event
              </a>
              <a href="#" className="btn btn-quiet">
                Subscribe &rarr;
              </a>
            </div>
          </div>
          <div className="filters">
            {filterDefs.map((f) => (
              <button
                key={f.key}
                className="filter"
                aria-pressed={f.key === filter}
                onClick={() => setFilter(f.key)}
              >
                {f.color ? (
                  <span className="dot" style={{ background: f.color }}></span>
                ) : null}
                {f.label}
              </button>
            ))}
          </div>
          <div>
            {calRows.length ? (
              calRows.map((ev) => {
                const { day, mon } = eventDay(ev);
                const open = openSlots(ev);
                return (
                  <button
                    key={ev.id}
                    className="ev"
                    style={
                      { "--src": groupColor(ev.groups[0]) } as React.CSSProperties
                    }
                    onClick={() => setSheetId(ev.id)}
                  >
                    <div className="ev-when">
                      <b>{day}</b>
                      <span>{mon}</span>
                    </div>
                    <div className="ev-what">
                      <h3>{ev.title}</h3>
                      <div className="ev-meta">
                        {ev.groups.map((g) => (
                          <span className="who" key={g}>
                            <span
                              className="dot"
                              style={{ background: groupColor(g) }}
                            ></span>
                            {groupName(g)}
                          </span>
                        ))}
                        <span>{ev.time}</span>
                        <span>{placeLine(ev)}</span>
                        {open ? (
                          <span className="ev-open">
                            {open} slot{open === 1 ? "" : "s"} open
                          </span>
                        ) : null}
                      </div>
                      <div className="tags" style={{ marginTop: "0.5rem" }}>
                        {ev.tags.map((t) => (
                          <span key={t} className="tag-pill">
                            {TAGS[t].label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="ev-go">&rarr;</span>
                  </button>
                );
              })
            ) : (
              <p className="lede">
                Nothing on the calendar for that yet. Try another filter.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Posted this month</p>
              <h2>What&apos;s new</h2>
              <p className="lede">Posted by parents, for parents.</p>
            </div>
            <a href="#" className="btn btn-quiet">
              All announcements &rarr;
            </a>
          </div>
          <div className="notices">
            {ANNOUNCEMENTS.map((x) => (
              <article
                key={x.title}
                className="notice"
                style={{ "--src": groupColor(x.group) } as React.CSSProperties}
              >
                <span className="who">
                  <span className="dot"></span>
                  {groupName(x.group)}
                </span>
                <span className="when">{fmtDate(x.date)}</span>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Donor wall */}
      <section id="thanks" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Thank you</p>
              <h2>Who showed up for Senn</h2>
              <p className="lede">
                Neighbors and local businesses who gave money, food, space, or
                gear this year.
              </p>
            </div>
          </div>
          <div className="donors">
            {DONORS.map((d) => (
              <div
                key={d.name}
                className="donor"
                style={{ "--src": groupColor(d.group) } as React.CSSProperties}
              >
                <b>{d.name}</b>
                <p>{d.gave}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="wrap">
          <div className="about-grid">
            <div>
              <p className="eyebrow">About</p>
              <h2>Parent led. For our kids.</h2>
              <p className="lede" style={{ marginTop: "1rem" }}>
                Senn Parents is the shared front door for every parent and
                community group at Nicholas Senn High School. Each group runs
                itself, sets its own agenda, and elects its own leaders. This
                site is how families find them, hear from them, and show up.
              </p>
              <p className="lede" style={{ marginTop: "1rem" }}>
                You do not need to be a member to attend a meeting, ask a
                question, or bring an idea.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  marginTop: "1.75rem",
                }}
              >
                <a href="mailto:sennparents@gmail.com" className="btn btn-quiet">
                  Email us
                </a>
                <a href="#join" className="btn btn-quiet">
                  Join a list &rarr;
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow">Directory</p>
              <ul className="dir-list">
                {GROUPS.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/groups/${g.slug}`}>
                      <span
                        className="dot"
                        style={{ background: g.color }}
                      ></span>
                      {g.full}
                      <span className="go">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <UmbrellaFooter />

      {/* Event detail sheet */}
      {sheetEvent ? (
        <div
          className="sheet open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSheetId(null);
          }}
        >
          <div
            className="sheet-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
          >
            <button
              className="sheet-close"
              aria-label="Close"
              onClick={() => setSheetId(null)}
            >
              &times;
            </button>
            <div className="tags">
              {sheetEvent.tags.map((t) => (
                <span key={t} className="tag-pill">
                  {TAGS[t].label}
                </span>
              ))}
            </div>
            <h3 id="sheet-title">{sheetEvent.title}</h3>
            <div className="sheet-row">
              <b>When</b>
              <span>
                {fmtDate(sheetEvent.date)} &middot; {sheetEvent.time}
                {sheetEvent.ends ? ` to ${sheetEvent.ends}` : ""}
              </span>
            </div>
            <div className="sheet-row">
              <b>Where</b>
              <span>
                {placeLine(sheetEvent)}
                {mapLink(sheetEvent) ? (
                  <>
                    {" "}
                    &middot;{" "}
                    <a
                      href={mapLink(sheetEvent) ?? undefined}
                      target="_blank"
                      rel="noopener"
                    >
                      Map
                    </a>
                  </>
                ) : null}
              </span>
            </div>
            {sheetEvent.place.virtual ? (
              <div className="sheet-row">
                <b>Online</b>
                <span>
                  <a
                    href={sheetEvent.place.virtual}
                    target="_blank"
                    rel="noopener"
                  >
                    Join the video call
                  </a>
                </span>
              </div>
            ) : null}
            <div className="sheet-row">
              <b>Who</b>
              <span>
                {sheetEvent.groups.map((g) => groupFull(g)).join(" and ")}
              </span>
            </div>
            <p className="sheet-body">{sheetEvent.body}</p>
            {sheetEvent.slots ? (
              <>
                <p className="lbl" style={{ marginBottom: "0.6rem" }}>
                  Open slots
                </p>
                {sheetEvent.slots.map((s) => (
                  <div className="slot" key={s.label}>
                    <span className="left">{s.label}</span>
                    <span className="count">
                      <b>{s.open}</b> open &middot; {s.filled} filled
                    </span>
                  </div>
                ))}
              </>
            ) : null}
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
                marginTop: "1.5rem",
              }}
            >
              {sheetEvent.rsvp ? (
                <a href="#" className="btn btn-green">
                  Sign me up
                </a>
              ) : null}
              <a href="#" className="btn btn-quiet">
                Add to calendar
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
