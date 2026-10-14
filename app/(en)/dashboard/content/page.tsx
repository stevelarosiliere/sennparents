"use client";

import DashboardShell from "@/components/staff/DashboardShell";

export default function SiteContentPage() {
  return (
    <DashboardShell requireRole="admin" backHref="/dashboard">
      {() => (
        <section>
          <span className="dash-role-tag">Admin</span>
          <h2>Site Content</h2>
          <p className="lede" style={{ marginBottom: "1.5rem" }}>
            Edit announcements, events, and group information.
          </p>
          <div className="dash-card">
            <p>Content editing tools are on the way.</p>
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
