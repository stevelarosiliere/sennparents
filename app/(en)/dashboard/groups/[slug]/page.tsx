"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DashboardShell from "@/components/staff/DashboardShell";
import GroupEvents from "@/components/staff/GroupEvents";
import GroupAnnouncements from "@/components/staff/GroupAnnouncements";
import GroupSubscribers from "@/components/staff/GroupSubscribers";
import GroupEmail from "@/components/staff/GroupEmail";
import GroupTeam from "@/components/staff/GroupTeam";
import { GROUP_BY_SLUG, type GroupSlug } from "@/lib/umbrella-data";

const TABS = [
  { key: "events", label: "Events", leadOnly: false },
  { key: "news", label: "Announcements", leadOnly: false },
  { key: "list", label: "Mailing list", leadOnly: true },
  { key: "email", label: "Send email", leadOnly: true },
  { key: "team", label: "Team", leadOnly: true },
] as const;
type Tab = (typeof TABS)[number]["key"];

function Workspace({ group, myEmail }: { group: GroupSlug; myEmail?: string }) {
  const access = useQuery(api.users.myAccess);
  const [tab, setTab] = useState<Tab>("events");
  const g = GROUP_BY_SLUG[group];

  if (access === undefined) return <p className="lede">Loading…</p>;
  const mine = access.groups.find((x) => x.group === group);
  if (!mine) {
    return (
      <div className="dash-card">
        <h3>You&apos;re not on {g.full}</h3>
        <p>
          Ask for access from <Link href="/dashboard">your dashboard</Link>.
        </p>
      </div>
    );
  }
  const isLead = mine.role === "lead";
  const tabs = TABS.filter((t) => isLead || !t.leadOnly);

  return (
    <section>
      <span className="dash-role-tag">
        {access.isAdmin ? "Site admin" : isLead ? "Lead" : "Editor"}
      </span>
      <h2>{g.full}</h2>
      <p className="lede">
        <Link href={`/groups/${group}`}>View the public page &rarr;</Link>
      </p>

      <div className="dash-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className="dash-tab"
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "events" ? <GroupEvents group={group} isAdmin={access.isAdmin} /> : null}
      {tab === "news" ? <GroupAnnouncements group={group} /> : null}
      {tab === "list" && isLead ? <GroupSubscribers group={group} /> : null}
      {tab === "email" && isLead ? (
        <GroupEmail group={group} myEmail={myEmail} />
      ) : null}
      {tab === "team" && isLead ? (
        <GroupTeam group={group} isAdmin={access.isAdmin} />
      ) : null}
    </section>
  );
}

export default function GroupWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const group = GROUP_BY_SLUG[slug] ? (slug as GroupSlug) : null;

  return (
    <DashboardShell backHref="/dashboard">
      {(_role, user) =>
        group ? (
          <Workspace group={group} myEmail={user.email} />
        ) : (
          <p className="lede">There&apos;s no group at this address.</p>
        )
      }
    </DashboardShell>
  );
}
