"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Nav from "@/components/Nav";
import UmbrellaFooter from "@/components/home/UmbrellaFooter";
import {
  EFFORTS,
  LEADERS,
  MINUTES,
  SUBCOMMITTEES,
  fmtDate,
  groupFull,
  placeLine,
  type Group,
} from "@/lib/umbrella-data";
import { chicagoToday } from "@/lib/time";

const navLinks = [
  { href: "/#groups", label: "Groups" },
  { href: "/#volunteer", label: "Volunteer" },
  { href: "/#calendar", label: "Events" },
  { href: "/#news", label: "News" },
  { href: "/#join", label: "Join", pill: true },
];

const SECTION_LABELS: Record<string, string> = {
  announcements: "Announcements",
  events: "Events",
  about: "About",
  efforts: "Current efforts",
  minutes: "Minutes",
  bylaws: "Bylaws",
  grants: "Grants & support",
  subcommittees: "Subcommittees",
  kyr: "Know Your Rights",
  resources: "Resources",
  contact: "Contact",
};

export default function GroupPage({ group }: { group: Group }) {
  const G = group;
  const mainRef = useRef<HTMLDivElement>(null);
  const subnavRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => chicagoToday(), []);
  const upcoming = useQuery(api.events.listUpcoming, { from: today });
  const news = useQuery(api.announcements.listPublishedForGroup, {
    group: G.slug,
  });
  const gEvents = (upcoming ?? []).filter((x) => x.groups.includes(G.slug));
  const gNews = news ?? [];
  const gEfforts = EFFORTS.filter((x) => x.group === G.slug);
  const sections = G.sections.filter((k) => SECTION_LABELS[k]);

  /* Highlight the section you're actually looking at */
  useEffect(() => {
    const links = [
      ...(subnavRef.current?.querySelectorAll("a") ?? []),
    ] as HTMLAnchorElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((l) =>
            l.classList.toggle(
              "active",
              l.getAttribute("href") === `#${e.target.id}`
            )
          );
        });
      },
      { rootMargin: "-130px 0px -70% 0px" }
    );
    mainRef.current
      ?.querySelectorAll("section")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const joinHref = G.joinable ? `/?join=${G.slug}#join` : "/#join";

  const renderSection = (key: string) => {
    switch (key) {
      case "announcements":
        return gNews.length ? (
          gNews.map((x) => (
            <div className="news-item" key={x.id}>
              <div className="card-date">{fmtDate(x.date)}</div>
              <h3>{x.title}</h3>
              <p>{x.body}</p>
            </div>
          ))
        ) : (
          <p className="lede">No announcements posted yet.</p>
        );

      case "events":
        return gEvents.length ? (
          <div className="gp-cards">
            {gEvents.map((x) => (
              <article className="gp-card" key={x.id}>
                <div className="card-date">
                  {fmtDate(x.date)} &middot; {x.time}
                </div>
                <h3>{x.title}</h3>
                <p>{placeLine(x)}</p>
                <div className="card-foot">
                  <a href="#" className="link-more">
                    Add to calendar
                  </a>
                  {x.rsvp ? (
                    <a href="#" className="link-more">
                      RSVP
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="lede">Nothing on the calendar right now.</p>
        );

      case "about":
        return (
          <div className="two-col">
            <div className="panel">
              <h3>What {G.name} does</h3>
              <p>{G.blurb}</p>
              <p style={{ color: "var(--ink-60)", marginTop: "0.75rem" }}>
                <b>Who it&apos;s for:</b> {G.who}
              </p>
              <p style={{ color: "var(--ink-60)", marginTop: "0.75rem" }}>
                Meetings are open. You do not need to be a member to attend,
                ask a question, or bring an idea.
              </p>
            </div>
            <div>
              <h3>Who&apos;s leading</h3>
              <div className="people">
                {(LEADERS[G.slug] ?? []).map(([role, name]) => (
                  <div className="person" key={role}>
                    <div className="role">{role}</div>
                    <div className="name">{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "efforts":
        return gEfforts.length ? (
          gEfforts.map((x) => (
            <div
              className="need"
              key={x.title}
              style={
                {
                  "--src": G.color,
                  marginBottom: "0.85rem",
                } as React.CSSProperties
              }
            >
              <div className="need-main">
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
          ))
        ) : (
          <p className="lede">
            No open asks right now. Check back, or join the list to hear
            first.
          </p>
        );

      case "minutes":
        return (
          <div className="panel">
            {Object.entries(MINUTES).map(([year, docs]) => (
              <div key={year}>
                <div className="year-head">{year}</div>
                <ul className="doc-list">
                  {docs.map(([t, m]) => (
                    <li key={t}>
                      <a href="#">{t}</a>
                      <span className="meta">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case "bylaws":
        return (
          <div className="panel">
            <ul className="doc-list">
              <li>
                <a href="#">{G.name} bylaws (current)</a>
                <span className="meta">Adopted 2026</span>
              </li>
              <li>
                <a href="#">Proposed amendments</a>
                <span className="meta">Under review</span>
              </li>
            </ul>
          </div>
        );

      case "grants":
        return (
          <div className="two-col">
            <div className="panel">
              <h3>Request support</h3>
              <p>
                Teachers and staff can request funding for classroom needs,
                field trips, and program costs. Applications open twice a
                year.
              </p>
              <p style={{ marginTop: "1rem" }}>
                <a href="#" className="btn btn-quiet">
                  Start a request
                </a>
              </p>
            </div>
            <div className="panel">
              <h3>What we&apos;ve funded</h3>
              <ul className="doc-list">
                <li>
                  <a href="#">Library collection refresh</a>
                  <span className="meta">$3,200</span>
                </li>
                <li>
                  <a href="#">Classroom laptops</a>
                  <span className="meta">$2,800</span>
                </li>
                <li>
                  <a href="#">Field trip transportation</a>
                  <span className="meta">$1,400</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case "subcommittees":
        return (
          <div className="sub-list">
            {(SUBCOMMITTEES[G.slug] ?? []).map(([n, d]) => (
              <div className="sub-item" key={n}>
                <strong>{n}</strong>
                <span>{d}</span>
              </div>
            ))}
          </div>
        );

      case "kyr":
        return (
          <div className="two-col">
            <div className="panel">
              <h3>Know your rights</h3>
              <p>
                Every family has rights regardless of status. Trainings run
                monthly in English and Spanish, and cards are free in the main
                office.
              </p>
              <p
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                }}
              >
                <a href="#" className="btn btn-quiet">
                  KYR card (English)
                </a>
                <a href="#" className="btn btn-quiet">
                  Tarjeta KYR (Español)
                </a>
              </p>
            </div>
            <div className="panel">
              <h3>If something happens</h3>
              <p>
                Call the rapid response line. Someone answers, in your
                language, and a trained parent responds.
              </p>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                Rapid response: (773) 555-0142
              </p>
            </div>
          </div>
        );

      case "resources":
        return (
          <div className="panel">
            <ul className="doc-list">
              <li>
                <a href="#">Family safety plan template</a>
                <span className="meta">PDF, EN/ES</span>
              </li>
              <li>
                <a href="#">Legal aid and immigration attorneys</a>
                <span className="meta">Directory</span>
              </li>
              <li>
                <a href="#">School policy on visitors and records</a>
                <span className="meta">CPS</span>
              </li>
              <li>
                <a href="#">Chicago rapid response network</a>
                <span className="meta">External</span>
              </li>
            </ul>
          </div>
        );

      case "contact":
        return (
          <div className="two-col">
            <div>
              <p className="lede">
                Questions, ideas, or something the group should know? This
                goes straight to the{" "}
                {G.secretary ? `${G.name} secretary` : "group"}, with a copy
                to the shared Senn Parents inbox so nothing gets lost.
              </p>
              <div className="route-note">
                Routes to: <b>{G.secretary ?? "Senn Parents inbox"}</b> +
                sennparents@gmail.com
              </div>
            </div>
            <div className="panel">
              <div className="f">
                <span className="lbl">Your name</span>
                <input type="text" placeholder="First and last" />
              </div>
              <div className="f">
                <span className="lbl">Email</span>
                <input type="email" placeholder="you@email.com" />
              </div>
              <div className="f">
                <span className="lbl">Message</span>
                <textarea rows={4} placeholder="What's on your mind?" />
              </div>
              <button className="btn btn-green" style={{ width: "100%" }}>
                Send to {G.name}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="gp" style={{ "--accent": G.color } as React.CSSProperties}>
      <Nav links={navLinks} />

      <header
        className="g-hero"
        style={{
          background: `linear-gradient(135deg, ${G.color} 0%, rgba(0,0,0,0.55) 130%)`,
        }}
      >
        <div className="wrap">
          <p className="kicker">
            {G.parent ? `Subcommittee of ${groupFull(G.parent)}` : "Senn Parents"}
          </p>
          <h1>{G.full}</h1>
          <p>{G.blurb}</p>
          <div className="actions">
            <Link href={joinHref} className="btn btn-gold">
              Join this group
            </Link>
            <a href="#events" className="btn btn-line">
              See their events
            </a>
          </div>
        </div>
      </header>

      <div className="subnav">
        <div className="subnav-inner" ref={subnavRef}>
          {sections.map((k) => (
            <a key={k} href={`#${k}`}>
              {SECTION_LABELS[k]}
            </a>
          ))}
          <a href="#join">Join</a>
        </div>
      </div>

      <main ref={mainRef}>
        {sections.map((k) => (
          <section id={k} key={k}>
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <div className="rule"></div>
                  <h2>{SECTION_LABELS[k]}</h2>
                </div>
                {k === "events" ? (
                  <a href="#" className="link-more">
                    Add to your calendar &rarr;
                  </a>
                ) : null}
              </div>
              {renderSection(k)}
            </div>
          </section>
        ))}

        <section className="join-strip" id="join">
          <div className="wrap">
            <p className="eyebrow">Same form, every group</p>
            <h2>Join {G.name}</h2>
            <p>
              One signup covers every parent group at Senn.
              {G.joinable
                ? " This one is prechecked for you. Add others if you want them."
                : " This group is information-only for now, but the form covers every other group."}
            </p>
            <Link href={joinHref} className="btn btn-gold">
              Go to the signup
            </Link>
          </div>
        </section>
      </main>

      <UmbrellaFooter />
    </div>
  );
}
