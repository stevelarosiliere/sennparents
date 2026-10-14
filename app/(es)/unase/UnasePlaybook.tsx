"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Shield from "@/components/Shield";

const navLinks = [
  { href: "/es", label: "Inicio" },
  { href: "/es#meeting", label: "Próxima Reunión" },
  { href: "/es#about", label: "Acerca de" },
  { href: "/es#contact", label: "Contacto" },
  { href: "/join", label: "English" },
  { href: "/vota", label: "Votar", pill: true },
];

const TOTAL_SCREENS = 7;

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxoARfseF_T4vG7df09vjoeN5BSBcdZjd3ZQjimNZLP0vM-fepHndSbDbAwgkk2iLUj/exec";

export default function UnasePlaybook() {
  const [started, setStarted] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showOtherLang, setShowOtherLang] = useState(false);

  function goToScreen(n: number) {
    if (n < 1 || n > TOTAL_SCREENS) return;
    setCurrentScreen(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitPlaybookForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData(e.currentTarget);

    // Collect contact preferences
    const contactPrefs: string[] = [];
    if (data.get("contact_email")) contactPrefs.push("Email");
    if (data.get("contact_text")) contactPrefs.push("Text");
    if (data.get("contact_whatsapp")) contactPrefs.push("WhatsApp");

    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      student: data.get("student"),
      grade: data.get("grade"),
      phone: data.get("phone") || "",
      language:
        data.get("language") === "Other"
          ? data.get("language_other") || "Other"
          : data.get("language"),
      contact: contactPrefs.join(", "),
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch {
      setSubmitting(false);
      alert(
        "Algo salió mal. Por favor intente de nuevo o envíe un correo a sennparents@gmail.com."
      );
    }
  }

  return (
    <>
      <style>{`
        /* Intro: green arch card, the playbook's front door */
        .pb-intro { padding: 2.5rem 0 4rem; }
        .intro-card {
            background: var(--green);
            color: var(--white);
            border-radius: 999px 999px var(--r-lg) var(--r-lg);
            box-shadow: inset 0 0 0 1.5px rgba(212,160,23,0.35);
            max-width: 760px;
            margin: 0 auto;
            padding: 4.5rem 2.5rem 3rem;
            text-align: center;
        }
        .intro-shield { width: 54px; margin: 0 auto 1.5rem; }
        .intro-card h1 {
            font-size: clamp(1.9rem, 4.5vw, 2.6rem);
            font-weight: 900;
            margin-bottom: 0.75rem;
        }
        .intro-card h1 em { font-style: normal; color: var(--gold); }
        .intro-lede {
            font-size: 1.05rem;
            color: rgba(255,255,255,0.85);
            max-width: 52ch;
            margin: 0 auto 2rem;
        }
        .intro-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            text-align: left;
            margin-bottom: 2rem;
        }
        .intro-cell {
            background: rgba(255,255,255,0.1);
            border-radius: 14px;
            padding: 1rem;
        }
        .intro-cell .cell-icon { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .intro-cell p { font-size: 0.85rem; font-weight: 600; }
        .intro-note { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.85rem; }

        /* Progress: floating white pill, green done / gold now */
        .progress-bar { padding: 1.5rem 1.25rem 0; }
        .progress-inner {
            max-width: 620px;
            margin: 0 auto;
            background: var(--white);
            border-radius: 999px;
            box-shadow: 0 2px 20px rgba(22,33,26,0.09);
            padding: 0.85rem 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
        }
        .progress-dot {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--bone);
            box-shadow: inset 0 0 0 1.5px var(--line);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 800;
            color: var(--ink-60);
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        .progress-dot.completed {
            background: var(--green);
            box-shadow: none;
            color: var(--white);
        }
        .progress-dot.active {
            background: var(--gold);
            box-shadow: 0 0 0 4px var(--gold-soft);
            color: var(--ink);
        }
        .progress-line {
            width: 32px;
            height: 3px;
            background: var(--line);
            transition: background 0.3s ease;
        }
        .progress-line.completed { background: var(--green); }
        .progress-label {
            text-align: center;
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--ink-60);
            margin-top: 0.75rem;
        }

        /* Screens */
        .screen { display: none; min-height: calc(100vh - 200px); }
        .screen.active { display: block; }
        .screen-content {
            max-width: 720px;
            margin: 0 auto;
            padding: 3rem 1.5rem 1rem;
        }
        .screen-content h1 {
            font-size: clamp(1.7rem, 3.5vw, 2.3rem);
            margin-bottom: 1.25rem;
        }

        .content-block { margin-bottom: 1.25rem; }
        .content-block p {
            font-size: 1.05rem;
            color: var(--ink-60);
            margin-bottom: 1rem;
            line-height: 1.7;
        }
        .content-block ul { list-style: none; padding: 0; }
        .content-block ul li {
            padding: 0.75rem 0 0.75rem 1.75rem;
            position: relative;
            font-size: 1rem;
            color: var(--ink-60);
            border-bottom: 1px solid var(--line);
        }
        .content-block ul li:last-child { border-bottom: none; }
        .content-block ul li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 1.15rem;
            width: 8px;
            height: 8px;
            background: var(--gold);
            border-radius: 50%;
        }

        .highlight-box {
            background: var(--gold-soft);
            border-radius: var(--r);
            padding: 1.1rem 1.3rem;
            margin-top: 1.5rem;
            font-weight: 600;
            color: var(--green);
            font-size: 0.95rem;
        }

        /* Info cards: white on bone, D shadow */
        .cards-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            margin-top: 1.5rem;
        }
        .info-card {
            background: var(--white);
            border-radius: var(--r);
            padding: 1.5rem;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
        }
        .info-card .card-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: var(--gold-soft);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            margin-bottom: 0.6rem;
        }
        .info-card h4 {
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: -0.015em;
            margin-bottom: 0.35rem;
        }
        .info-card p { font-size: 0.88rem; color: var(--ink-60); line-height: 1.5; }

        /* Priority cards */
        .priority-cards {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1.25rem;
            margin-top: 1.5rem;
        }
        .priority-card {
            background: var(--white);
            border-radius: var(--r);
            border-top: 4px solid var(--gold);
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
        }
        .priority-badge {
            display: inline-block;
            background: var(--gold-soft);
            color: var(--green);
            font-weight: 800;
            font-size: 0.72rem;
            letter-spacing: 0.08em;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            margin-bottom: 0.5rem;
        }
        .priority-card .card-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .priority-card h4 { font-size: 1rem; font-weight: 800; margin-bottom: 0.25rem; }
        .priority-card .pct { font-size: 1.6rem; font-weight: 900; color: var(--green); }

        /* Stat boxes */
        .stat-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .stat-box {
            background: var(--green-soft);
            border-radius: var(--r);
            padding: 1.25rem;
            text-align: center;
        }
        .stat-box .stat-number { font-size: 1.9rem; font-weight: 900; color: var(--green); line-height: 1.1; }
        .stat-box .stat-label { font-size: 0.85rem; color: var(--ink-60); margin-top: 0.15rem; }

        /* Officer cards, gold-topped like the homepage */
        .officers-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1.25rem;
        }
        .officer-card {
            background: var(--white);
            border: 1px solid var(--line);
            border-top: 4px solid var(--gold);
            border-radius: var(--r);
            padding: 1.1rem 1.25rem;
        }
        .officer-role {
            font-size: 0.73rem;
            font-weight: 800;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--ink-60);
            margin-bottom: 0.2rem;
        }
        .officer-name { font-size: 1rem; font-weight: 800; }

        /* What's Next items */
        .next-item {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            padding: 1.25rem 0;
            border-bottom: 1px solid var(--line);
        }
        .next-item:last-child { border-bottom: none; }
        .next-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 0.1rem; }
        .next-item p { font-size: 0.97rem; color: var(--ink-60); line-height: 1.65; }
        .next-item strong { color: var(--ink); }
        .next-item a { color: var(--green-mid); font-weight: 600; }

        /* Form: white card, global .f/.lbl fields */
        .form-section {
            background: var(--white);
            border-radius: var(--r-lg);
            padding: 2.5rem 2rem;
            margin-top: 1rem;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
        }
        .form-section h2 {
            text-align: center;
            font-size: clamp(1.4rem, 3vw, 1.8rem);
            margin-bottom: 0.75rem;
        }
        .form-sub {
            text-align: center;
            color: var(--ink-60);
            font-size: 0.95rem;
            margin: 0 auto 2rem;
            max-width: 500px;
        }
        .lbl .opt {
            text-transform: none;
            letter-spacing: normal;
            font-weight: 500;
            color: var(--ink-40);
        }
        .f .chips { margin-bottom: 0; }
        .consent-label {
            display: flex;
            align-items: flex-start;
            gap: 0.6rem;
            font-size: 0.9rem;
            color: var(--ink-60);
            line-height: 1.45;
            cursor: pointer;
        }
        .consent-label input {
            margin-top: 0.2rem;
            flex-shrink: 0;
            accent-color: var(--green);
        }

        /* Screen nav */
        .screen-nav {
            max-width: 720px;
            margin: 0 auto;
            padding: 1rem 1.5rem 3.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.75rem;
        }

        /* Success */
        .success-message { display: none; text-align: center; padding: 3rem 1.5rem; }
        .success-message .checkmark {
            width: 80px;
            height: 80px;
            background: var(--green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 2.5rem;
            color: var(--white);
        }
        .success-message h2 { margin-bottom: 0.5rem; }
        .success-message p { color: var(--ink-60); font-size: 1rem; max-width: 400px; margin: 0 auto; }

        /* Mobile */
        @media (max-width: 768px) {
            .screen-content { padding: 2rem 1.25rem 1rem; }
            .cards-grid, .priority-cards, .officers-grid, .stat-row, .intro-grid {
                grid-template-columns: 1fr;
            }
            .progress-line { width: 16px; }
            .progress-dot { width: 26px; height: 26px; font-size: 0.65rem; }
            .form-section { padding: 1.75rem 1.25rem; }
            .screen-nav { padding: 1rem 1.25rem 2.5rem; }
            .intro-card { padding: 3.5rem 1.5rem 2.5rem; }
        }
        @media (max-width: 620px) {
            /* Cap the arch so it stays a window head, not a half circle */
            .intro-card { border-radius: 120px 120px var(--r) var(--r); }
            .screen-nav .btn { width: auto; }
            .progress-line { width: 10px; }
            .progress-dot { width: 24px; height: 24px; font-size: 0.6rem; }
        }
      `}</style>

      <Nav brandHref="/es" links={navLinks} toggleLabel="Alternar menú" />

      {/* Intro Landing */}
      <div id="playbook-intro" style={started ? { display: "none" } : undefined}>
        <section className="pb-intro">
          <div className="wrap">
            <div className="intro-card">
              <Shield
                className="intro-shield"
                outer="#D4A017"
                inner="#1B5E20"
                letter="#D4A017"
              />
              <h1>
                Antes de Unirse,
                <br />
                <em>Conozca el CAP</em>
              </h1>
              <p className="intro-lede">
                Esta guía rápida cubre cómo funcionan los fondos del Título I,
                qué hace el CAP y qué nos dicen los padres de Senn. Toma
                aproximadamente 5 minutos. Al final, puede registrarse como
                miembro.
              </p>

              <div className="intro-grid">
                <div className="intro-cell">
                  <div className="cell-icon">&#128176;</div>
                  <p>Cómo funcionan los fondos del Título I en Senn</p>
                </div>
                <div className="intro-cell">
                  <div className="cell-icon">&#128221;</div>
                  <p>En qué puede gastar dinero el CAP</p>
                </div>
                <div className="intro-cell">
                  <div className="cell-icon">&#128172;</div>
                  <p>Lo que más de 100 familias dijeron que importa</p>
                </div>
                <div className="intro-cell">
                  <div className="cell-icon">&#129309;</div>
                  <p>Cómo tener voz en la educación de su hijo</p>
                </div>
              </div>

              <button className="btn btn-gold" onClick={() => setStarted(true)}>
                Comencemos <span className="arrow">&rarr;</span>
              </button>
              <p className="intro-note">
                7 pantallas cortas. No se necesita cuenta.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Playbook Content (hidden until intro CTA clicked) */}
      <div id="playbook-content" style={{ display: started ? "block" : "none" }}>
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-inner" id="progress">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <span key={step} style={{ display: "contents" }}>
                <div
                  className={
                    step < currentScreen
                      ? "progress-dot completed"
                      : step === currentScreen
                      ? "progress-dot active"
                      : "progress-dot"
                  }
                  data-step={step}
                >
                  {step < currentScreen ? "✓" : step}
                </div>
                {step < TOTAL_SCREENS && (
                  <div
                    className={
                      step < currentScreen
                        ? "progress-line completed"
                        : "progress-line"
                    }
                    data-line={step}
                  ></div>
                )}
              </span>
            ))}
          </div>
          <div className="progress-label" id="progress-label">
            Paso {currentScreen} de {TOTAL_SCREENS}
          </div>
        </div>

        {/* Screen 1: ¿Qué es el Título I? */}
        <div className={currentScreen === 1 ? "screen active" : "screen"} data-screen="1">
          <div className="screen-content">
            <p className="eyebrow">Lo Básico</p>
            <h1>¿Qué es el Título I?</h1>
            <div className="content-block">
              <p>
                El Título I proporciona fondos federales para asegurar que todos
                los niños tengan igualdad de oportunidades para recibir una
                educación de calidad.
              </p>
              <p>
                La ley existe desde 1965. La versión actual se llama ESSA (Ley
                Cada Estudiante Triunfa).
              </p>
              <p>
                Cualquier escuela que reciba fondos del Título I debe reservar
                el 1% de su asignación para la Participación de Padres y
                Familias.
              </p>
            </div>
            <div className="highlight-box">
              Senn High School es una escuela de Título I. Eso significa que hay
              fondos específicamente para programas de padres.
            </div>
          </div>
          <div className="screen-nav">
            <div></div>
            <button className="btn btn-gold" onClick={() => goToScreen(2)}>
              Comenzar <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 2: ¿Por Qué Importa la Participación de los Padres? */}
        <div className={currentScreen === 2 ? "screen active" : "screen"} data-screen="2">
          <div className="screen-content">
            <p className="eyebrow">Por Qué Importa</p>
            <h1>¿Por Qué Importa la Participación de los Padres?</h1>
            <div className="content-block">
              <p>
                Los estudios demuestran que cuando los padres participan en la
                escuela de sus hijos, los estudiantes tienen un mejor desempeño
                social y académico.
              </p>
              <ul>
                <li>
                  Los padres tienen la oportunidad de asesorar al director sobre
                  las necesidades de los padres.
                </li>
                <li>
                  Los padres aprenden sobre las necesidades académicas de sus
                  estudiantes.
                </li>
                <li>
                  Los padres dirigen los gastos en capacitaciones que
                  desarrollan sus habilidades para ayudar a sus hijos
                  académicamente.
                </li>
              </ul>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(1)}>
              Atrás
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(3)}>
              Siguiente <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 3: ¿En Qué Se Pueden Gastar los Fondos del CAP? */}
        <div className={currentScreen === 3 ? "screen active" : "screen"} data-screen="3">
          <div className="screen-content">
            <p className="eyebrow">El Presupuesto</p>
            <h1>¿En Qué Se Pueden Gastar los Fondos del CAP?</h1>
            <div className="content-block">
              <p>
                Los fondos de participación de padres del Título I tienen reglas
                específicas sobre cómo pueden ser utilizados.
              </p>
            </div>
            <div className="cards-grid">
              <div className="info-card">
                <div className="card-icon">&#127891;</div>
                <h4>Talleres y Capacitaciones</h4>
                <p>
                  Para desarrollar habilidades de los padres y apoyar a sus
                  hijos académicamente
                </p>
              </div>
              <div className="info-card">
                <div className="card-icon">&#9749;</div>
                <h4>Refrigerios</h4>
                <p>
                  Hasta el 25% de los fondos del CAP se pueden gastar en
                  refrigerios ligeros para eventos
                </p>
              </div>
              <div className="info-card">
                <div className="card-icon">&#128186;</div>
                <h4>Muebles y Equipo</h4>
                <p>
                  Deben ser solo para padres. No pueden ser usados por personal
                  o estudiantes.
                </p>
              </div>
              <div className="info-card">
                <div className="card-icon">&#128203;</div>
                <h4>Materiales de Oficina</h4>
                <p>Solo pueden ser utilizados para asuntos del CAP</p>
              </div>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(2)}>
              Atrás
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(4)}>
              Siguiente <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 4: ¿Qué es el CAP? */}
        <div className={currentScreen === 4 ? "screen active" : "screen"} data-screen="4">
          <div className="screen-content">
            <p className="eyebrow">Su Consejo</p>
            <h1>¿Qué es el CAP?</h1>
            <div className="content-block">
              <p>
                El Consejo Asesor de Padres es un organismo dirigido por padres
                en cada escuela de Título I. Existe para asegurar que las voces
                de los padres influyan en cómo la escuela invierte en la
                participación familiar.
              </p>
              <p>El CAP es independiente de la administración escolar.</p>
              <ul>
                <li>
                  Recomendamos cómo se gastan los fondos de participación de
                  padres del Título I.
                </li>
                <li>
                  Co-desarrollamos la política de participación de padres con la
                  administración.
                </li>
                <li>
                  Conectamos a los padres con información sobre sus derechos
                  bajo la ley federal de educación.
                </li>
              </ul>
            </div>

            <p className="lbl" style={{ marginTop: "1.5rem" }}>
              Oficiales Actuales
            </p>
            <div className="officers-grid">
              <div className="officer-card">
                <div className="officer-role">Presidente</div>
                <div className="officer-name">Jason Menard</div>
              </div>
              <div className="officer-card">
                <div className="officer-role">Vicepresidente</div>
                <div className="officer-name">Katie Denny</div>
              </div>
              <div className="officer-card">
                <div className="officer-role">Secretario/a</div>
                <div className="officer-name">Kathryn Clark</div>
              </div>
              <div className="officer-card">
                <div className="officer-role">Coordinador de Alcance</div>
                <div className="officer-name">Steve Larosiliere</div>
              </div>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(3)}>
              Atrás
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(5)}>
              Siguiente <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 5: Conviértase en Miembro del CAP */}
        <div className={currentScreen === 5 ? "screen active" : "screen"} data-screen="5">
          <div className="screen-content">
            {!submitted && (
              <div className="form-section" id="registration-form-section">
                <p className="eyebrow" style={{ textAlign: "center" }}>
                  Únase
                </p>
                <h2>Ahora que conoce el CAP, conviértase en miembro.</h2>
                <p className="form-sub">
                  Al registrarse, se une a un grupo de padres de Senn que
                  trabajan para asegurar que los fondos del Título I sirvan a
                  nuestras familias.
                </p>

                <form id="playbook-form" onSubmit={submitPlaybookForm}>
                  <div className="f">
                    <label className="lbl">Nombre Completo *</label>
                    <input type="text" name="name" required />
                  </div>
                  <div className="f">
                    <label className="lbl">Correo Electrónico *</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="f">
                    <label className="lbl">Nombre(s) del Estudiante *</label>
                    <input type="text" name="student" required />
                  </div>
                  <div className="f">
                    <label className="lbl">Grado(s) del Estudiante *</label>
                    <select name="grade" required defaultValue="">
                      <option value="">Seleccione el grado</option>
                      <option value="9">9.&deg; Grado</option>
                      <option value="10">10.&deg; Grado</option>
                      <option value="11">11.&deg; Grado</option>
                      <option value="12">12.&deg; Grado</option>
                      <option value="multiple">Varios</option>
                    </select>
                  </div>
                  <div className="f">
                    <label className="lbl">
                      Teléfono{" "}
                      <span className="opt">
                        (opcional, para actualizaciones por texto/WhatsApp)
                      </span>
                    </label>
                    <input type="tel" name="phone" />
                  </div>
                  <div className="f">
                    <label className="lbl">Idioma Preferido</label>
                    <select
                      name="language"
                      defaultValue="Spanish"
                      onChange={(e) => setShowOtherLang(e.target.value === "Other")}
                    >
                      <option value="English">Inglés</option>
                      <option value="Spanish">Español</option>
                      <option value="Other">Otro</option>
                    </select>
                    <input
                      type="text"
                      id="other-lang"
                      name="language_other"
                      placeholder="Por favor especifique su idioma"
                      style={{
                        display: showOtherLang ? "block" : "none",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                  <div className="f">
                    <span className="lbl">
                      ¿Cómo quiere recibir noticias nuestras?
                    </span>
                    <div className="chips">
                      <label className="chip">
                        <input
                          type="checkbox"
                          name="contact_email"
                          value="Email"
                          defaultChecked
                        />{" "}
                        Correo Electrónico
                      </label>
                      <label className="chip">
                        <input type="checkbox" name="contact_text" value="Text" />{" "}
                        Texto
                      </label>
                      <label className="chip">
                        <input
                          type="checkbox"
                          name="contact_whatsapp"
                          value="WhatsApp"
                        />{" "}
                        WhatsApp
                      </label>
                    </div>
                  </div>
                  <div className="f">
                    <label className="consent-label">
                      <input type="checkbox" name="consent" required />
                      <span>
                        He revisado la Guía del CAP y entiendo cómo funciona la
                        participación de padres del Título I en Senn.
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    id="playbook-submit"
                    className="btn btn-green"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    {submitting ? "Enviando..." : "Regístrese como Miembro"}
                  </button>
                </form>
              </div>
            )}

            <div
              className="success-message"
              id="playbook-success"
              style={submitted ? { display: "block" } : undefined}
            >
              <div className="checkmark">&#10003;</div>
              <h2>¡Bienvenido al CAP de Senn!</h2>
              <p>
                Está oficialmente registrado. Ahora vea lo que dicen las
                familias y vote por nuestro primer taller.
              </p>
              <button
                className="btn btn-green"
                style={{ marginTop: "1.5rem" }}
                onClick={() => goToScreen(6)}
              >
                Ver Resultados de la Encuesta <span className="arrow">&rarr;</span>
              </button>
            </div>
          </div>
          {!submitted && (
            <div className="screen-nav" id="screen-5-nav">
              <button className="btn btn-quiet" onClick={() => goToScreen(4)}>
                Atrás
              </button>
              <div></div>
            </div>
          )}
        </div>

        {/* Screen 6: ¿Qué Nos Dijeron los Padres de Senn? */}
        <div className={currentScreen === 6 ? "screen active" : "screen"} data-screen="6">
          <div className="screen-content">
            <p className="eyebrow">Resultados de la Encuesta</p>
            <h1>¿Qué Nos Dijeron los Padres de Senn?</h1>
            <div className="content-block">
              <p>
                En la Entrega de Boletas de Calificaciones del 18 de marzo, más
                de 100 familias respondieron a nuestra encuesta.
              </p>
            </div>

            <p className="lbl">Las 3 Prioridades Principales</p>
            <div className="priority-cards">
              <div className="priority-card">
                <span className="priority-badge">#1</span>
                <div className="card-icon">&#127891;</div>
                <h4>Planificación Universitaria y Profesional</h4>
                <div className="pct">75%</div>
              </div>
              <div className="priority-card">
                <span className="priority-badge">#2</span>
                <div className="card-icon">&#128154;</div>
                <h4>Salud Mental y Bienestar</h4>
                <div className="pct">65%</div>
              </div>
              <div className="priority-card">
                <span className="priority-badge">#3</span>
                <div className="card-icon">&#9878;&#65039;</div>
                <h4>Conozca Sus Derechos</h4>
                <div className="pct">40%</div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-box">
                <div className="stat-number">85%</div>
                <div className="stat-label">
                  Quieren mantenerse conectados con el CAP
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-number">45%</div>
                <div className="stat-label">
                  Nunca habían oído hablar del CAP antes de ese día
                </div>
              </div>
            </div>

            <div className="highlight-box">
              Idiomas representados: inglés, español, kinyarwanda, swahili, y
              más.
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(5)}>
              Atrás
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(7)}>
              Siguiente <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 7: ¿Qué Sigue? */}
        <div className={currentScreen === 7 ? "screen active" : "screen"} data-screen="7">
          <div className="screen-content">
            <p className="eyebrow">Tome Acción</p>
            <h1>¿Qué Sigue?</h1>
            <div className="content-block">
              <div className="next-item">
                <div className="next-icon">&#128499;</div>
                <div>
                  <p>
                    <strong>Vote por el primer taller</strong> que el CAP
                    debería organizar.
                    <br />
                    <Link href="/vota">Emita su voto aquí.</Link>
                  </p>
                </div>
              </div>
              <div className="next-item">
                <div className="next-icon">&#128197;</div>
                <div>
                  <p>
                    <strong>Próxima reunión del CAP:</strong> martes 21 de abril
                    de 2026, 7:00&ndash;8:30 PM (hora central) en Little Red
                    Nest, 5456 N. Ashland Ave, Chicago, IL 60640. Opción
                    virtual:{" "}
                    <a
                      href="https://us06web.zoom.us/j/8611443771"
                      target="_blank"
                      rel="noopener"
                    >
                      Únase por Zoom
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="next-item">
                <div className="next-icon">&#128176;</div>
                <div>
                  <p>
                    Los fondos del CAP del Título I (Subvención #430329, Fondo
                    332) no están sujetos a la fecha límite de gastos generales
                    del 8 de abril, pero las actividades deben programarse en
                    abril y mayo antes del último día de clases el 4 de junio.
                  </p>
                </div>
              </div>
              <div className="next-item">
                <div className="next-icon">&#127919;</div>
                <div>
                  <p>
                    El CAP seleccionará un proveedor aprobado por CPS y
                    programará el taller ganador en mayo.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(6)}>
              Atrás
            </button>
            <Link href="/vota" className="btn btn-gold">
              Votar Ahora <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* End playbook content wrapper */}
      </div>

      <Footer lang="es" />
    </>
  );
}
