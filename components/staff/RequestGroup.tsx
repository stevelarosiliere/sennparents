"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GROUPS, groupFull, type GroupSlug } from "@/lib/umbrella-data";
import { errorText } from "@/lib/errors";

/** Ask a group's lead for access. Shows the open request if there is one. */
export default function RequestGroup({
  requested,
  exclude = [],
}: {
  requested?: GroupSlug;
  exclude?: GroupSlug[];
}) {
  const requestGroup = useMutation(api.users.requestGroup);
  const [group, setGroup] = useState<GroupSlug | "">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;
    setBusy(true);
    setError("");
    try {
      await requestGroup({ group });
      setGroup("");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ textAlign: "left" }}>
      {requested ? (
        <p className="form-ok">
          Waiting on {groupFull(requested)}. A lead from that group or a site
          admin will approve you.
        </p>
      ) : null}
      <label className="f">
        <span className="lbl">
          {requested ? "Asked the wrong group?" : "Which group are you with?"}
        </span>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value as GroupSlug)}
        >
          <option value="">Pick a group</option>
          {GROUPS.filter((g) => !exclude.includes(g.slug)).map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.full}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="dash-btn" type="submit" disabled={!group || busy}>
        {requested ? "Change request" : "Ask for access"}
      </button>
    </form>
  );
}
