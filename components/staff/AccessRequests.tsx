"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { GROUPS, groupFull, type GroupSlug } from "@/lib/umbrella-data";
import { errorText } from "@/lib/errors";

type Role = "lead" | "editor";

/**
 * People asking for access. Leads see requests for their own groups and
 * can add them as editors. Admins see everyone and can pick any group
 * and role.
 */
export default function AccessRequests({ isAdmin }: { isAdmin: boolean }) {
  const requests = useQuery(api.users.listRequests);
  const approve = useMutation(api.users.approve);
  const deny = useMutation(api.users.deny);
  const [busyId, setBusyId] = useState<Id<"users"> | null>(null);
  const [error, setError] = useState("");
  const [picks, setPicks] = useState<
    Record<string, { group: GroupSlug | ""; role: Role }>
  >({});

  if (requests === undefined) return <p>Loading requests…</p>;
  if (requests.length === 0) {
    return <p style={{ color: "var(--ink-60)" }}>No one is waiting for access.</p>;
  }

  const pickFor = (id: string, requested?: GroupSlug) =>
    picks[id] ?? { group: requested ?? "", role: "editor" as Role };

  const act = async (
    userId: Id<"users">,
    action: "approve" | "deny",
    pick?: { group: GroupSlug | ""; role: Role },
  ) => {
    setError("");
    if (action === "approve" && !pick?.group) {
      setError("Pick a group before approving.");
      return;
    }
    setBusyId(userId);
    try {
      if (action === "approve" && pick?.group) {
        await approve({ userId, group: pick.group, role: pick.role });
      } else {
        await deny({ userId });
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {error ? <p className="form-error">{error}</p> : null}
      <ul className="user-list" style={{ marginTop: 0 }}>
        {requests.map((u) => {
          const pick = pickFor(u._id, u.requestedGroup);
          return (
            <li key={u._id} className="user-row">
              <div className="user-row-info">
                <strong>{u.name ?? u.email ?? "Unnamed account"}</strong>
                {u.name && u.email ? <span>{u.email}</span> : null}
                <span>
                  {u.requestedGroup
                    ? `Wants to help with ${groupFull(u.requestedGroup)}`
                    : "Hasn't picked a group yet"}
                  {u.role === "staff" ? " (already helps another group)" : ""}
                </span>
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
                {isAdmin ? (
                  <div className="request-picks">
                    <select
                      aria-label="Group"
                      value={pick.group}
                      onChange={(e) =>
                        setPicks({
                          ...picks,
                          [u._id]: { ...pick, group: e.target.value as GroupSlug },
                        })
                      }
                    >
                      <option value="">Group…</option>
                      {GROUPS.map((g) => (
                        <option key={g.slug} value={g.slug}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Role"
                      value={pick.role}
                      onChange={(e) =>
                        setPicks({
                          ...picks,
                          [u._id]: { ...pick, role: e.target.value as Role },
                        })
                      }
                    >
                      <option value="editor">Editor</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                ) : null}
                <button
                  className="user-approve"
                  disabled={busyId === u._id}
                  onClick={() => void act(u._id, "approve", pick)}
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
          );
        })}
      </ul>
    </>
  );
}
