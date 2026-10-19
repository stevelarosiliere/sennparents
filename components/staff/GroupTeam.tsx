"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { type GroupSlug } from "@/lib/umbrella-data";
import { errorText } from "@/lib/errors";

/**
 * The group's leads and editors. Leads can remove editors; admins can
 * also promote or demote. New people come in through access requests.
 */
export default function GroupTeam({
  group,
  isAdmin,
}: {
  group: GroupSlug;
  isAdmin: boolean;
}) {
  const team = useQuery(api.users.team, { group });
  const setRole = useMutation(api.users.setGroupRole);
  const [busyId, setBusyId] = useState<Id<"users"> | null>(null);
  const [error, setError] = useState("");

  const change = async (userId: Id<"users">, role: "lead" | "editor" | null) => {
    setBusyId(userId);
    setError("");
    try {
      await setRole({ userId, group, role });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="dash-toolbar">
        <p>
          New volunteers sign up at sennparents.com/signup and pick this group.
          Their request shows up on your dashboard for you to approve.
        </p>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="dash-card">
        {team === undefined ? (
          <p>Loading…</p>
        ) : team.length === 0 ? (
          <p>No one is on this group yet.</p>
        ) : (
          <ul className="user-list" style={{ marginTop: 0 }}>
            {team.map((m) => (
              <li key={m.userId} className="user-row">
                <div className="user-row-info">
                  <strong>{m.name ?? m.email ?? "Unnamed account"}</strong>
                  {m.name && m.email ? <span>{m.email}</span> : null}
                  <span>{m.role === "lead" ? "Lead" : "Editor"}</span>
                </div>
                <div className="user-row-actions">
                  {isAdmin ? (
                    <button
                      className="dash-btn dash-btn-quiet"
                      disabled={busyId === m.userId}
                      onClick={() =>
                        void change(m.userId, m.role === "lead" ? "editor" : "lead")
                      }
                    >
                      Make {m.role === "lead" ? "editor" : "lead"}
                    </button>
                  ) : null}
                  {isAdmin || m.role === "editor" ? (
                    <button
                      className="user-deny"
                      disabled={busyId === m.userId}
                      onClick={() => void change(m.userId, null)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
