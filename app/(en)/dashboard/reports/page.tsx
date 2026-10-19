"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DashboardShell from "@/components/staff/DashboardShell";
import { groupFull } from "@/lib/umbrella-data";

function Reports() {
  const counts = useQuery(api.subscribers.countsAll);
  if (counts === undefined) return <p>Loading…</p>;
  return (
    <>
      <div className="dash-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="dash-card">
          <p>Parents on at least one list</p>
          <div className="dash-stat">{counts.total}</div>
        </div>
      </div>
      <div className="dash-card dash-scroll">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>On the list</th>
            </tr>
          </thead>
          <tbody>
            {counts.byGroup.map((r) => (
              <tr key={r.group}>
                <td>{groupFull(r.group)}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ReportsPage() {
  return (
    <DashboardShell requireRole="admin" backHref="/dashboard">
      {() => (
        <section>
          <span className="dash-role-tag">Site admin</span>
          <h2>Reports</h2>
          <p className="lede" style={{ marginBottom: "1.5rem" }}>
            Mailing list sizes for every group.
          </p>
          <Reports />
        </section>
      )}
    </DashboardShell>
  );
}
