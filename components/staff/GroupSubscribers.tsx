"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type GroupSlug } from "@/lib/umbrella-data";

const LANG = { en: "English", es: "Español", other: "Other" } as const;

function csvCell(s: string) {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function GroupSubscribers({ group }: { group: GroupSlug }) {
  const rows = useQuery(api.subscribers.listForGroup, { group });

  const download = () => {
    if (!rows) return;
    const lines = [
      "Name,Email,Grade,Language,Joined",
      ...rows.map((r) =>
        [
          r.name,
          r.email,
          r.grade ?? "",
          LANG[r.language],
          new Date(r.joined).toISOString().slice(0, 10),
        ]
          .map(csvCell)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `senn-${group}-list.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="dash-toolbar">
        <p>
          Parents who joined this group&apos;s list from the homepage. Treat this
          as private: don&apos;t share it outside the group&apos;s leaders.
        </p>
        <button
          className="dash-btn dash-btn-quiet"
          onClick={download}
          disabled={!rows?.length}
        >
          Download CSV
        </button>
      </div>
      <div className="dash-card dash-scroll">
        {rows === undefined ? (
          <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p>No one has joined yet. Share the homepage signup link.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Language</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.grade ?? ""}</td>
                  <td>{LANG[r.language]}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(r.joined).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
