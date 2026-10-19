"use client";

import DashboardShell from "@/components/staff/DashboardShell";
import AccessRequests from "@/components/staff/AccessRequests";
import ManageUsers from "@/components/staff/ManageUsers";

export default function ManageUsersPage() {
  return (
    <DashboardShell requireRole="admin" backHref="/dashboard">
      {() => (
        <section>
          <span className="dash-role-tag">Site admin</span>
          <h2>Manage users</h2>
          <p className="lede" style={{ marginBottom: "1.5rem" }}>
            Approve new accounts and decide who leads or edits each group.
            Group leads can approve their own editors, so most requests never
            need you.
          </p>
          <h3 style={{ marginBottom: "0.9rem" }}>Waiting for access</h3>
          <div className="dash-card">
            <AccessRequests isAdmin />
          </div>
          <div className="dash-section">
            <h3>Everyone</h3>
            <ManageUsers />
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
