"use client";

import Link from "next/link";
import DashboardShell from "@/components/staff/DashboardShell";

function AdminDashboard() {
  return (
    <section>
      <span className="dash-role-tag">Admin</span>
      <h2>Admin Dashboard</h2>
      <p className="lede" style={{ marginBottom: "1.5rem" }}>
        Pick a tool below. More admin tools are on the way.
      </p>
      <div className="dash-grid">
        <Link href="/dashboard/users" className="dash-card dash-card-link">
          <h3>Manage Users</h3>
          <p>Approve or deny new account requests.</p>
        </Link>
        <Link href="/dashboard/content" className="dash-card dash-card-link">
          <h3>Site Content</h3>
          <p>Edit announcements, events, and group information.</p>
        </Link>
        <Link href="/dashboard/reports" className="dash-card dash-card-link">
          <h3>Reports</h3>
          <p>Survey results, volunteer signups, and meeting attendance.</p>
        </Link>
      </div>
    </section>
  );
}

function StaffDashboard() {
  return (
    <section>
      <span className="dash-role-tag">Staff</span>
      <h2>Staff Dashboard</h2>
      <p className="lede" style={{ marginBottom: "1.5rem" }}>
        Placeholder — staff tools will live here.
      </p>
      <div className="dash-grid">
        <div className="dash-card">
          <h3>Announcements</h3>
          <p>Post updates for parents and families.</p>
        </div>
        <div className="dash-card">
          <h3>Events</h3>
          <p>Add or update upcoming meetings and events.</p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      {(role) => (role === "admin" ? <AdminDashboard /> : <StaffDashboard />)}
    </DashboardShell>
  );
}
