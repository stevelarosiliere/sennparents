"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/** Approve or deny accounts waiting on the pending list. */
export default function ManageUsers() {
  const pending = useQuery(api.users.listPending);
  const approve = useMutation(api.users.approve);
  const deny = useMutation(api.users.deny);
  const [busyId, setBusyId] = useState<Id<"users"> | null>(null);

  const act = async (userId: Id<"users">, action: "approve" | "deny") => {
    setBusyId(userId);
    try {
      await (action === "approve" ? approve({ userId }) : deny({ userId }));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="dash-card">
      {pending === undefined ? (
        <p>Loading pending accounts…</p>
      ) : pending.length === 0 ? (
        <p>No accounts waiting for approval.</p>
      ) : (
        <ul className="user-list">
          {pending.map((u) => (
            <li key={u._id} className="user-row">
              <div className="user-row-info">
                <strong>{u.name ?? "Unnamed account"}</strong>
                <span>{u.email ?? "No email"}</span>
                <span className="user-row-date">
                  Signed up{" "}
                  {new Date(u._creationTime).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="user-row-actions">
                <button
                  className="user-approve"
                  disabled={busyId === u._id}
                  onClick={() => void act(u._id, "approve")}
                >
                  Approve
                </button>
                <button
                  className="user-deny"
                  disabled={busyId === u._id}
                  onClick={() => void act(u._id, "deny")}
                >
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
