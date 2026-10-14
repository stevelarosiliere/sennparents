"use client";

import DashboardShell from "@/components/staff/DashboardShell";
import ManageUsers from "@/components/staff/ManageUsers";

export default function ManageUsersPage() {
  return (
    <DashboardShell requireRole="admin" backHref="/dashboard">
      {() => (
        <section>
          <span className="dash-role-tag">Admin</span>
          <h2>Manage Users</h2>
          <p className="lede" style={{ marginBottom: "1.5rem" }}>
            Approve or deny new account requests.
          </p>
          <ManageUsers />
        </section>
      )}
    </DashboardShell>
  );
}
