"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { GROUPS, groupName, type GroupSlug } from "@/lib/umbrella-data";
import { errorText } from "@/lib/errors";

type Role = "lead" | "editor";

const ACCOUNT_LABEL = {
  admin: "Site admin",
  staff: "Approved",
  pending: "Pending",
  denied: "Denied",
} as const;

/** Everyone with an account, their group roles, and controls to change them. */
export default function ManageUsers() {
  const users = useQuery(api.users.listAll);
  const setRole = useMutation(api.users.setGroupRole);
  const [busyId, setBusyId] = useState<Id<"users"> | null>(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState<
    Record<string, { group: GroupSlug | ""; role: Role }>
  >({});

  const change = async (
    userId: Id<"users">,
    group: GroupSlug,
    role: Role | null,
  ) => {
    setBusyId(userId);
    setError("");
    try {
      await setRole({ userId, group, role });
      setAdding((a) => ({ ...a, [userId]: { group: "", role: "editor" } }));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  if (users === undefined) return <div className="dash-card">Loading…</div>;

  return (
    <div className="dash-card">
      {error ? <p className="form-error">{error}</p> : null}
      <ul className="user-list" style={{ marginTop: 0 }}>
        {users.map((u) => {
          const pick = adding[u._id] ?? { group: "", role: "editor" as Role };
          const approved = u.role === "staff" || u.role === "admin";
          return (
            <li key={u._id} className="user-row">
              <div className="user-row-info">
                <strong>{u.name ?? u.email ?? "Unnamed account"}</strong>
                {u.name && u.email ? <span>{u.email}</span> : null}
                <span>{ACCOUNT_LABEL[u.role]}</span>
                {u.role !== "admin" ? (
                  <div className="user-row-groups">
                    {u.groups.length === 0 ? (
                      <span>No groups</span>
                    ) : (
                      u.groups.map((g) => (
                        <span key={g.group} className="role-chip">
                          {groupName(g.group)} &middot;{" "}
                          {g.role === "lead" ? "Lead" : "Editor"}
                          <button
                            aria-label={`Remove from ${groupName(g.group)}`}
                            disabled={busyId === u._id}
                            onClick={() => void change(u._id, g.group, null)}
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
              {approved && u.role !== "admin" ? (
                <div className="user-row-actions request-picks">
                  <select
                    aria-label="Group"
                    value={pick.group}
                    onChange={(e) =>
                      setAdding({
                        ...adding,
                        [u._id]: { ...pick, group: e.target.value as GroupSlug },
                      })
                    }
                  >
                    <option value="">Add to group…</option>
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
                      setAdding({
                        ...adding,
                        [u._id]: { ...pick, role: e.target.value as Role },
                      })
                    }
                  >
                    <option value="editor">Editor</option>
                    <option value="lead">Lead</option>
                  </select>
                  <button
                    className="user-approve"
                    disabled={!pick.group || busyId === u._id}
                    onClick={() =>
                      pick.group && void change(u._id, pick.group, pick.role)
                    }
                  >
                    Add
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
