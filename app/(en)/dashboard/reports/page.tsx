"use client";

import DashboardShell from "@/components/staff/DashboardShell";

export default function ReportsPage() {
  return (
    <DashboardShell requireRole="admin" backHref="/dashboard">
      {() => (
        <section>
          <span className="dash-role-tag">Admin</span>
          <h2>Reports</h2>
          <p className="lede" style={{ marginBottom: "1.5rem" }}>
            Survey results, volunteer signups, and meeting attendance.
          </p>
          <div className="dash-card">
            <p>Reports are on the way.</p>
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
