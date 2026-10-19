"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "es";
type Pair = { en: string; es: string };

// Answers post straight into the Google Form "Senn PAC Family Interest Survey 2026-2027".
// Option values must match the form's English options exactly, even on the Spanish view.
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeE2VqmnxrifYdv_syu2cNJSPDcMlKM-uKW62uJ7VV8U2ckcA/formResponse";
const CONTACT_ENTRIES = {
  name: "entry.2092082828",
  email: "entry.216564400",
  phone: "entry.1352227040",
} as const;
const OTHER = "__other_option__";

type Question = {
  entry: string;
  type: "checkbox" | "radio";
  required?: boolean;
  max?: number;
  en: string;
  es: string;
  hint?: Pair;
  otherText?: Pair;
  options: [string, string][];
};

const CHECK_ALL: Pair = { en: "Check all that apply", es: "Marque todas las que apliquen" };

const QUESTIONS: Question[] = [
  {
    entry: "entry.1374248103",
    type: "checkbox",
    required: true,
    en: "What grade(s) is your student in?",
    es: "¿En qué grado(s) está su estudiante?",
    hint: CHECK_ALL,
    options: [
      ["9th Grade", "9no grado"],
      ["10th Grade", "10mo grado"],
      ["11th Grade", "11vo grado"],
      ["12th Grade", "12vo grado"],
    ],
  },
  {
    entry: "entry.1418374658",
    type: "radio",
    required: true,
    en: "What language do you prefer for school communications?",
    es: "¿En qué idioma prefiere recibir las comunicaciones de la escuela?",
    otherText: { en: "Please type your language", es: "Escriba su idioma" },
    options: [
      ["English", "Inglés"],
      ["Spanish", "Español"],
      ["Arabic", "Árabe"],
      ["Swahili", "Suajili"],
      ["Kinyarwanda", "Kinyarwanda"],
      ["French", "Francés"],
      ["Dari", "Darí"],
      ["Pashto", "Pastún"],
      ["Urdu", "Urdu"],
      ["Nepali", "Nepalí"],
      ["Burmese", "Birmano"],
      ["Amharic", "Amárico"],
      [OTHER, "Otro"],
    ],
  },
  {
    entry: "entry.1504247458",
    type: "checkbox",
    required: true,
    max: 3,
    en: "Pick your TOP 3 topics the PAC should focus on this year.",
    es: "Elija los 3 temas PRINCIPALES en los que el CAP debe enfocarse este año.",
    hint: {
      en: "Choose up to 3. These answers directly inform how Title I parent engagement funds are spent.",
      es: "Elija hasta 3. Estas respuestas guían directamente cómo se gastan los fondos de Título I.",
    },
    options: [
      [
        "Learning how to read report cards, test scores, and track academic progress",
        "Aprender a leer boletas de calificaciones, resultados de exámenes y seguir el progreso académico",
      ],
      [
        "Supporting your student's mental health and well-being",
        "Apoyar la salud mental y el bienestar de su estudiante",
      ],
      ["English/literacy classes for parents", "Clases de inglés/alfabetización para padres"],
      [
        "Workshops on college applications and career planning",
        "Talleres sobre solicitudes universitarias y planificación profesional",
      ],
      [
        "Help understanding FAFSA and financial aid",
        "Ayuda para entender FAFSA y la ayuda financiera",
      ],
      [
        "Know Your Rights workshops (immigration, housing, special education)",
        "Talleres Conozca Sus Derechos (inmigración, vivienda, educación especial)",
      ],
      [
        "Family arts, culture, or community events",
        "Eventos familiares de arte, cultura o comunidad",
      ],
      [
        "Technology help (school apps, email, internet safety)",
        "Ayuda con tecnología (aplicaciones escolares, correo, seguridad en internet)",
      ],
      ["Other", "Otro"],
    ],
  },
  {
    entry: "entry.1114584111",
    type: "checkbox",
    en: "When could you attend a PAC event or workshop?",
    es: "¿Cuándo podría asistir a un evento o taller del CAP?",
    hint: CHECK_ALL,
    options: [
      ["Weekday mornings (8 AM - 11 AM)", "Mañanas entre semana (8 AM a 11 AM)"],
      ["Weekday afternoons (12 PM - 3 PM)", "Tardes entre semana (12 PM a 3 PM)"],
      ["Weekday evenings (4 PM - 8 PM)", "Noches entre semana (4 PM a 8 PM)"],
      ["Saturday mornings (8 AM - 11 AM)", "Sábados por la mañana (8 AM a 11 AM)"],
      ["Saturday afternoons (12 PM - 3 PM)", "Sábados por la tarde (12 PM a 3 PM)"],
      [
        "Virtual options work best with my schedule",
        "Las opciones virtuales funcionan mejor con mi horario",
      ],
    ],
  },
  {
    entry: "entry.1792102114",
    type: "checkbox",
    en: "What makes it hard to participate in school events?",
    es: "¿Qué le dificulta participar en eventos escolares?",
    hint: CHECK_ALL,
    options: [
      ["Work schedule", "Horario de trabajo"],
      ["Childcare", "Cuidado de niños"],
      ["Transportation", "Transporte"],
      ["Language barrier", "Barrera del idioma"],
      ["Unaware of events", "No me entero de los eventos"],
      ["Events don't apply to my family", "Los eventos no aplican a mi familia"],
      ["Other", "Otro"],
    ],
  },
  {
    entry: "entry.247959433",
    type: "checkbox",
    en: "How would you like to hear from the PAC?",
    es: "¿Cómo le gustaría recibir noticias del CAP?",
    hint: CHECK_ALL,
    options: [
      ["Email", "Correo electrónico"],
      ["Text message", "Mensaje de texto"],
      ["WhatsApp", "WhatsApp"],
      ["Social media (Facebook, Instagram)", "Redes sociales (Facebook, Instagram)"],
      ["School flyer", "Volante de la escuela"],
    ],
  },
  {
    entry: "entry.101407146",
    type: "radio",
    required: true,
    en: "Have you heard of the Senn PAC before today?",
    es: "¿Había escuchado sobre el CAP de Senn antes de hoy?",
    options: [
      ["Yes", "Sí"],
      ["No", "No"],
    ],
  },
  {
    entry: "entry.1335046319",
    type: "radio",
    required: true,
    en: "Would you be interested in staying connected with the Senn PAC?",
    es: "¿Le interesaría mantenerse en contacto con el CAP de Senn?",
    options: [
      ["Yes, I want to get involved!", "¡Sí, quiero participar!"],
      [
        "I can't attend meetings, but keep me informed",
        "No puedo asistir a reuniones, pero manténganme informado/a",
      ],
      ["Not at this time", "Por ahora no"],
    ],
  },
];

const ERR = {
  required: { en: "Please answer this question.", es: "Por favor responda esta pregunta." },
  max3: { en: "Please choose no more than 3.", es: "Por favor elija un máximo de 3." },
  fix: {
    en: "A few answers need attention above.",
    es: "Algunas respuestas necesitan atención arriba.",
  },
  network: {
    en: "Something went wrong. Please try again or email sennparents@gmail.com.",
    es: "Algo salió mal. Intente de nuevo o escriba a sennparents@gmail.com.",
  },
};

type ErrKey = keyof typeof ERR;

function T({ en, es }: Pair) {
  return (
    <>
      <span className="en">{en}</span>
      <span className="es">{es}</span>
    </>
  );
}

export default function SurveyForm() {
  const [lang, setLang] = useState<Lang>("en");
  const [answers, setAnswers] = useState<string[][]>(() => QUESTIONS.map(() => []));
  const [otherText, setOtherText] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, ErrKey>>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState<ErrKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const es =
      /lang=es/.test(window.location.search) || document.referrer.includes("/es");
    if (es) setLang("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const home = lang === "es" ? "/es" : "/";

  const pick = (qi: number, value: string, checked: boolean) => {
    const q = QUESTIONS[qi];
    setAnswers((prev) => {
      const next = [...prev];
      if (q.type === "radio") next[qi] = [value];
      else if (!checked) next[qi] = prev[qi].filter((v) => v !== value);
      // Enforce the top-3 limit as people tap, not just on submit
      else if (q.max && prev[qi].length >= q.max) return prev;
      else next[qi] = [...prev[qi], value];
      return next;
    });
    setErrors((prev) => {
      const { [qi]: _, ...rest } = prev;
      return rest;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const data = new URLSearchParams();
    const bad: Record<number, ErrKey> = {};
    QUESTIONS.forEach((q, i) => {
      const picked = answers[i];
      if (q.required && picked.length === 0) bad[i] = "required";
      else if (q.max && picked.length > q.max) bad[i] = "max3";
      picked.forEach((v) => data.append(q.entry, v));
      if (q.otherText && picked[0] === OTHER) {
        const other = (otherText[i] ?? "").trim();
        if (!other && !bad[i]) bad[i] = "required";
        data.append(`${q.entry}.other_option_response`, other);
      }
    });
    setErrors(bad);
    const firstBad = Object.keys(bad).map(Number).sort((a, b) => a - b)[0];
    if (firstBad !== undefined) {
      setFormError("fix");
      document
        .getElementById(`q${firstBad + 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    (Object.keys(CONTACT_ENTRIES) as (keyof typeof CONTACT_ENTRIES)[]).forEach((k) => {
      const v = contact[k].trim();
      if (v) data.append(CONTACT_ENTRIES[k], v);
    });

    setBusy(true);
    try {
      await fetch(FORM_URL, { method: "POST", mode: "no-cors", body: data });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("network");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sv" data-lang={lang}>
      <style>{`
        .sv { --red: #C62828; font-family: var(--font-figtree), -apple-system, sans-serif; color: var(--gray-900); background: var(--off-white); line-height: 1.6; min-height: 100vh; }
        .sv-header { background: var(--green); padding: 1.5rem 1rem; text-align: center; }
        .sv-header img { height: 44px; border-radius: 4px; margin-bottom: 0.5rem; }
        .sv-header h1 { color: var(--white); font-size: 1.3rem; font-weight: 800; }
        .sv-header p { color: rgba(255,255,255,0.85); font-size: 0.9rem; margin-top: 0.25rem; }
        .sv-links { margin-top: 0.75rem; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .sv-links a { color: var(--gold); font-size: 0.85rem; text-decoration: none; font-weight: 600; }
        .sv-toggle { background: none; border: 1px solid var(--gold); color: var(--gold); border-radius: 999px; padding: 0.2rem 0.9rem; font: inherit; font-size: 0.85rem; font-weight: 600; cursor: pointer; }

        .sv-body { max-width: 620px; margin: 1.5rem auto 2rem; padding: 0 1rem; }
        .sv-intro { background: var(--white); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem; border-top: 4px solid var(--gold); }
        .sv-intro h2 { color: var(--green); font-size: 1.1rem; margin-bottom: 0.4rem; }
        .sv-intro p { color: var(--gray-600); font-size: 0.92rem; }

        .sv-q { background: var(--white); border-radius: 12px; padding: 1.25rem 1.25rem 1rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 2px solid transparent; }
        .sv-q.invalid { border-color: var(--red); }
        .sv-label { font-weight: 600; font-size: 0.97rem; display: block; margin-bottom: 0.25rem; }
        .sv-hint { font-size: 0.8rem; color: var(--gray-600); margin-bottom: 0.6rem; }
        .sv-req { color: var(--red); }
        .sv-err { color: var(--red); font-size: 0.8rem; margin-top: 0.4rem; }

        .sv-opts { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.5rem; }
        .sv-opts label { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.92rem; color: var(--gray-700); padding: 0.55rem 0.7rem; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
        .sv-opts label:hover { background: var(--off-white); }
        .sv-opts input { accent-color: var(--green); width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; }

        .sv-contact { background: var(--gold-light); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
        .sv-contact .sv-label { color: var(--green); }
        .sv-field { margin-top: 0.75rem; }
        .sv-field label { font-size: 0.85rem; font-weight: 600; color: var(--gray-700); display: block; margin-bottom: 0.25rem; }
        .sv-field input, .sv-other { width: 100%; padding: 0.7rem 0.8rem; border: 1px solid #D1D5DB; border-radius: 8px; font: inherit; font-size: 1rem; background: var(--white); }
        .sv-field input:focus, .sv-other:focus { outline: 2px solid var(--green); border-color: var(--green); }
        .sv-other { margin-top: 0.5rem; }

        .sv-submit { background: var(--gold); color: var(--green); border: none; padding: 1rem 2rem; border-radius: 10px; font: inherit; font-size: 1.05rem; font-weight: 800; cursor: pointer; width: 100%; margin-top: 0.5rem; transition: transform 0.2s, box-shadow 0.2s; }
        .sv-submit:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .sv-submit:disabled { opacity: 0.6; cursor: wait; transform: none; }
        .sv-form-err { color: var(--red); font-size: 0.9rem; text-align: center; margin-top: 0.75rem; }

        .sv-done { text-align: center; padding: 2.5rem 1.5rem; background: var(--white); border-radius: 12px; border-top: 4px solid var(--gold); }
        .sv-done .icon { font-size: 3rem; margin-bottom: 0.75rem; }
        .sv-done h2 { color: var(--green); margin-bottom: 0.5rem; }
        .sv-done p { color: var(--gray-600); }
        .sv-done a { display: inline-block; margin-top: 1.25rem; background: var(--green); color: var(--white); padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 700; }

        .sv-foot { text-align: center; padding: 1.5rem 1rem 2.5rem; font-size: 0.8rem; color: var(--gray-600); }
        .sv-foot a { color: var(--green); }

        .sv[data-lang="es"] .en, .sv[data-lang="en"] .es { display: none; }
      `}</style>

      <div className="sv-header">
        <img src="/Brand-Assets/Logo/Social/sp-shield.jpg" alt="SP" />
        <h1>
          <T en="Senn Parent Survey 2026-27" es="Encuesta para Padres de Senn 2026-27" />
        </h1>
        <p>
          <T en="2 minutes. Your voice matters." es="2 minutos. Su voz importa." />
        </p>
        <div className="sv-links">
          <button
            type="button"
            className="sv-toggle"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
          >
            <T en="Español" es="English" />
          </button>
          <a href={home}>
            <T en="← Back to site" es="← Volver al sitio" />
          </a>
        </div>
      </div>

      <div className="sv-body">
        {done ? (
          <div className="sv-done">
            <div className="icon">&#9989;</div>
            <h2>
              <T en="Thank you!" es="¡Gracias!" />
            </h2>
            <p>
              <T
                en="Your response is in. The PAC will use it to plan this year's workshops and meetings."
                es="Su respuesta fue registrada. El CAP la usará para planear los talleres y reuniones de este año."
              />
            </p>
            <a href={home}>
              <T en="Back to Senn Parents" es="Volver a Senn Parents" />
            </a>
          </div>
        ) : (
          <>
            <div className="sv-intro">
              <h2>
                <T
                  en="Parent Advisory Council (PAC)"
                  es="Consejo Asesor de Padres (CAP)"
                />
              </h2>
              <p>
                <T
                  en="This survey helps the PAC understand what Senn families actually need this school year. Your answers guide how we recommend spending Title I family engagement funds. Last year over 100 families answered, and it shaped every workshop we planned."
                  es="Esta encuesta ayuda al CAP a entender lo que las familias de Senn realmente necesitan este año escolar. Sus respuestas guían cómo recomendamos gastar los fondos de Título I para la participación familiar. El año pasado más de 100 familias respondieron, y eso definió cada taller que planeamos."
                />
              </p>
            </div>

            <form onSubmit={submit} noValidate>
              {QUESTIONS.map((q, i) => {
                const n = i + 1;
                const err = errors[i];
                return (
                  <div className={`sv-q${err ? " invalid" : ""}`} id={`q${n}`} key={q.entry}>
                    <span className="sv-label">
                      {n}. <T en={q.en} es={q.es} />
                      {q.required ? <span className="sv-req"> *</span> : null}
                    </span>
                    {q.hint ? (
                      <p className="sv-hint">
                        <T {...q.hint} />
                      </p>
                    ) : null}
                    <div className="sv-opts">
                      {q.options.map(([value, es]) => (
                        <label key={value}>
                          <input
                            type={q.type}
                            name={`q${n}`}
                            value={value}
                            checked={answers[i].includes(value)}
                            onChange={(e) => pick(i, value, e.target.checked)}
                          />
                          <span>
                            <T en={value === OTHER ? "Other" : value} es={es} />
                          </span>
                        </label>
                      ))}
                      {q.otherText && answers[i][0] === OTHER ? (
                        <input
                          type="text"
                          className="sv-other"
                          placeholder={q.otherText[lang]}
                          value={otherText[i] ?? ""}
                          onChange={(e) =>
                            setOtherText((prev) => ({ ...prev, [i]: e.target.value }))
                          }
                        />
                      ) : null}
                    </div>
                    {err ? <p className="sv-err">{ERR[err][lang]}</p> : null}
                  </div>
                );
              })}

              <div className="sv-contact">
                <span className="sv-label">
                  <T en="Stay in the loop" es="Manténgase informado" />
                </span>
                <p className="sv-hint">
                  <T
                    en="Optional. Your survey answers above stay anonymous."
                    es="Opcional. Sus respuestas de la encuesta son anónimas."
                  />
                </p>
                <div className="sv-field">
                  <label htmlFor="f-name">
                    <T en="Your name" es="Su nombre" />
                  </label>
                  <input
                    type="text"
                    id="f-name"
                    autoComplete="name"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  />
                </div>
                <div className="sv-field">
                  <label htmlFor="f-email">
                    <T en="Email address" es="Correo electrónico" />
                  </label>
                  <input
                    type="email"
                    id="f-email"
                    autoComplete="email"
                    inputMode="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
                <div className="sv-field">
                  <label htmlFor="f-phone">
                    <T
                      en="Phone (for text or WhatsApp updates)"
                      es="Teléfono (para mensajes de texto o WhatsApp)"
                    />
                  </label>
                  <input
                    type="tel"
                    id="f-phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="sv-submit" disabled={busy}>
                <T en="Submit Survey" es="Enviar Encuesta" />
              </button>
              {formError ? <p className="sv-form-err">{ERR[formError][lang]}</p> : null}
            </form>
          </>
        )}
      </div>

      <div className="sv-foot">
        Senn Parent Advisory Council
        <br />
        <a href="mailto:sennparents@gmail.com">sennparents@gmail.com</a>
      </div>
    </div>
  );
}
