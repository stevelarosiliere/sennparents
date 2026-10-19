"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DashboardShell from "@/components/staff/DashboardShell";
import AccessRequests from "@/components/staff/AccessRequests";
import RequestGroup from "@/components/staff/RequestGroup";
import { GROUP_BY_SLUG, type GroupSlug } from "@/lib/umbrella-data";

function Dashboard({ requestedGroup }: { requestedGroup?: GroupSlug }) {
  const access = useQuery(api.users.myAccess);

  if (access === undefined) return <p className="lede">Loading…</p>;
  const leads = access.isAdmin || access.groups.some((g) => g.role === "lead");

  return (
    <section>
      <span className="dash-role-tag">
        {access.isAdmin ? "Site admin" : "Group volunteer"}
      </span>
      <h2>Your groups</h2>
      <p className="lede" style={{ marginBottom: "1.5rem" }}>
        {access.isAdmin
          ? "You can post for every group, approve anyone, and email any list."
          : "Post events and announcements for the groups you help run."}
      </p>

      {access.groups.length ? (
        <div className="dash-grid">
          {access.groups.map(({ group, role }) => {
            const g = GROUP_BY_SLUG[group];
            return (
              <Link
                key={group}
                href={`/dashboard/groups/${group}`}
                className="dash-card dash-card-link dash-group-card"
                style={{ "--dest": g.color } as React.CSSProperties}
              >
                <span className="dash-role-tag">
                  {role === "lead" ? "Lead" : "Editor"}
                </span>
                <h3>{g.full}</h3>
                <p>
                  {role === "lead"
                    ? "Events, announcements, the mailing list, and your team."
                    : "Events and announcements."}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="dash-card" style={{ maxWidth: 480 }}>
          <h3>You&apos;re not on a group yet</h3>
          <p style={{ marginBottom: "1rem" }}>
            Ask to join one and its lead will add you.
          </p>
          <RequestGroup requested={requestedGroup} />
        </div>
      )}

      {leads ? (
        <div className="dash-section">
          <h3>Waiting for access</h3>
          <div className="dash-card">
            <AccessRequests isAdmin={access.isAdmin} />
          </div>
        </div>
      ) : null}

      {!access.isAdmin && access.groups.length ? (
        <div className="dash-section">
          <h3>Help another group</h3>
          <div className="dash-card" style={{ maxWidth: 480 }}>
            <RequestGroup
              requested={requestedGroup}
              exclude={access.groups.map((g) => g.group)}
            />
          </div>
        </div>
      ) : null}

      {access.isAdmin ? (
        <div className="dash-section">
          <h3>Site admin</h3>
          <div className="dash-grid">
            <Link href="/dashboard/users" className="dash-card dash-card-link">
              <h3>Manage users</h3>
              <p>See everyone with an account and change their group roles.</p>
            </Link>
            <Link href="/dashboard/reports" className="dash-card dash-card-link">
              <h3>Reports</h3>
              <p>Mailing list sizes for every group.</p>
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      {(_role, user) => <Dashboard requestedGroup={user.requestedGroup} />}
    </DashboardShell>
  );
}
