"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { joinableGroups, type GroupSlug } from "@/lib/umbrella-data";
import { errorText } from "@/lib/errors";

type Language = "en" | "es" | "other";

const COPY = {
  en: {
    bad: "That link doesn't work anymore. Sign up again from the homepage to get a fresh one.",
    title: "Your email lists",
    for: "Lists for",
    lists: "I want to hear from",
    lang: "Language",
    save: "Save changes",
    saved: "Saved.",
    unsubAll: "Unsubscribe from everything",
    sureTitle: "Unsubscribe from every list?",
    sure: "You'll stop getting email from every Senn Parents group.",
    yes: "Yes, unsubscribe me",
    keep: "No, keep my lists",
    gone: "You're unsubscribed. You won't get any more email from Senn Parents.",
    rejoin: "Pick a group below and save to rejoin.",
  },
  es: {
    bad: "Ese enlace ya no funciona. Inscríbase de nuevo en la página principal para recibir uno nuevo.",
    title: "Sus listas de correo",
    for: "Listas de",
    lists: "Quiero recibir noticias de",
    lang: "Idioma",
    save: "Guardar cambios",
    saved: "Guardado.",
    unsubAll: "Darme de baja de todo",
    sureTitle: "¿Darse de baja de todas las listas?",
    sure: "Dejará de recibir correos de todos los grupos de Senn Parents.",
    yes: "Sí, darme de baja",
    keep: "No, mantener mis listas",
    gone: "Se dio de baja. No recibirá más correos de Senn Parents.",
    rejoin: "Elija un grupo abajo y guarde para volver a inscribirse.",
  },
};

export default function Preferences({
  token,
  unsubscribe,
}: {
  token: string;
  unsubscribe: boolean;
}) {
  const prefs = useQuery(api.subscribers.byToken, token ? { token } : "skip");
  const update = useMutation(api.subscribers.updatePreferences);
  const unsubscribeAll = useMutation(api.subscribers.unsubscribeAll);

  const [groups, setGroups] = useState<GroupSlug[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  const [confirming, setConfirming] = useState(unsubscribe);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (prefs && !loaded) {
      setGroups(prefs.groups);
      setLanguage(prefs.language);
      setLoaded(true);
    }
  }, [prefs, loaded]);

  const t = COPY[prefs?.language === "es" ? "es" : "en"];

  if (!token || prefs === null) {
    return (
      <div className="pending-card">
        <p>{COPY.en.bad}</p>
      </div>
    );
  }
  if (prefs === undefined) return <p className="lede">Loading…</p>;

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ ok: true, text: ok });
    } catch (err) {
      setMsg({ ok: false, text: errorText(err) });
    } finally {
      setBusy(false);
    }
  };

  if (confirming && prefs.status === "active") {
    return (
      <div className="pending-card">
        <h1>{t.sureTitle}</h1>
        <p style={{ marginBottom: "1.5rem" }}>{t.sure}</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="dash-btn"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await unsubscribeAll({ token });
                setGroups([]);
                setConfirming(false);
              }, t.gone)
            }
          >
            {t.yes}
          </button>
          <button className="dash-btn dash-btn-quiet" onClick={() => setConfirming(false)}>
            {t.keep}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="pending-card"
      style={{ textAlign: "left", maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => update({ token, groups, language }), t.saved);
      }}
    >
      <h1>{t.title}</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        {t.for} {prefs.email}
      </p>
      {prefs.status === "unsubscribed" && !msg ? (
        <p className="form-ok">
          {t.gone} {t.rejoin}
        </p>
      ) : null}

      <span className="lbl">{t.lists}</span>
      <div className="chips">
        {joinableGroups().map((g) => (
          <label className="chip" key={g.slug}>
            <input
              type="checkbox"
              checked={groups.includes(g.slug)}
              onChange={() =>
                setGroups((cur) =>
                  cur.includes(g.slug)
                    ? cur.filter((x) => x !== g.slug)
                    : [...cur, g.slug],
                )
              }
            />
            {g.name}
          </label>
        ))}
      </div>

      <label className="f">
        <span className="lbl">{t.lang}</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="other">Other</option>
        </select>
      </label>

      {msg ? (
        <p className={msg.ok ? "form-ok" : "form-error"}>{msg.text}</p>
      ) : null}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button className="dash-btn" type="submit" disabled={busy}>
          {t.save}
        </button>
        {prefs.status === "active" ? (
          <button
            type="button"
            className="dash-btn dash-btn-quiet"
            onClick={() => setConfirming(true)}
          >
            {t.unsubAll}
          </button>
        ) : null}
      </div>
    </form>
  );
}
