import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Shield from "@/components/Shield";
import { chicagoToday } from "@/lib/time";
import {
  PAC_ICS,
  PAC_MEETINGS,
  fmtPacDate,
  nextPacMeeting,
  pacGcalLink,
} from "@/lib/pac-meetings";

// Re-render hourly so the next meeting advances on its own.
export const revalidate = 3600;

const CAL_TITLE = "Reunión del CAP de Senn";
const CAL_DETAILS =
  "Reunión del Consejo Asesor de Padres, Nicholas Senn High School. Lugar y enlace: sennhs.org/apps/events o sennparents.com";

export const metadata: Metadata = {
  title: "Senn Parents | Consejo Asesor de Padres",
  description:
    "Consejo Asesor de Padres de Senn High School. Gobernanza liderada por padres para las familias de Nicholas Senn High School en Chicago. Únase al CAP, tome la encuesta de padres, asista a nuestra próxima reunión.",
  keywords:
    "Senn High School, Consejo Asesor de Padres, CAP, Title I, Chicago, Rogers Park, Edgewater, participación de padres, CPS, Nicholas Senn",
  openGraph: {
    title: "Senn Parents | Consejo Asesor de Padres",
    description:
      "Gobernanza liderada por padres en Senn High School. Únase al CAP, tome la encuesta de padres y ayude a decidir cómo se gastan los fondos de participación familiar del Título I.",
    type: "website",
    url: "https://sennparents.com",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senn Parents | Consejo Asesor de Padres",
    description:
      "Gobernanza liderada por padres en Senn High School. Únase al CAP y ayude a decidir cómo se gastan los fondos del Título I.",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

const navLinks = [
  { href: "#meeting", label: "Próxima Reunión" },
  { href: "/minutes", label: "Actas" },
  { href: "/survey?lang=es", label: "Encuesta" },
  { href: "#about", label: "Acerca de" },
  { href: "/", label: "English" },
  { href: "/unase", label: "Únase", pill: true },
];

export default function EsHomePage() {
  const today = chicagoToday();
  const next = nextPacMeeting(today);
  const nextDay = next ? Number(next.date.slice(8)) : null;
  const nextMon = next ? fmtPacDate(next.date, "es-US", { month: "long" }) : "";

  return (
    <>
      <style>{`
        .what-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: var(--gold-soft);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            margin-bottom: 0.4rem;
        }
        .pac-note {
            margin-top: 1.75rem;
            padding: 1.1rem 1.3rem;
            background: var(--gold-soft);
            border-radius: var(--r);
            font-weight: 600;
            color: var(--green);
        }
        .agenda {
            padding: 0.25rem 0 1.25rem;
        }
        .agenda h3 { font-size: 1.02rem; margin-bottom: 0.6rem; color: var(--green); }
        .agenda ul { list-style: none; }
        .agenda li {
            padding: 0.35rem 0 0.35rem 1.25rem;
            position: relative;
            color: var(--ink-60);
            font-size: 0.95rem;
        }
        .agenda li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.85rem;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--gold);
        }
        .year-list { margin-top: 1.5rem; }
        .year-list h3 { font-size: 1.05rem; color: var(--green); margin-bottom: 0.15rem; }
        .year-note { font-size: 0.88rem; color: var(--ink-60); margin-bottom: 0.75rem; }
        .year-list ul { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem 0.75rem; }
        .year-list li { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; padding: 0.55rem 0.8rem; border-radius: 10px; background: var(--off-white); font-size: 0.92rem; }
        .year-list li.next { background: var(--green); color: var(--white); }
        .year-list li.past { opacity: 0.5; }
        .yl-date { font-weight: 700; }
        .yl-tag { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: var(--gold); color: var(--green); padding: 0.1rem 0.5rem; border-radius: 999px; }
        .yl-tag.done { background: transparent; color: var(--ink-60); }
        .yl-add { font-size: 0.78rem; color: var(--green-mid); font-weight: 700; white-space: nowrap; }
        .year-all { margin: 1rem 0 1.25rem; }
        .cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .cta-card { background: var(--white); border-radius: var(--r); padding: 1.6rem; box-shadow: 0 2px 14px rgba(22,33,26,0.07); display: flex; flex-direction: column; align-items: flex-start; gap: 0.6rem; }
        .cta-card h3 { color: var(--green); font-size: 1.15rem; }
        .cta-card p { color: var(--ink-60); flex: 1; }
        @media (max-width: 700px) {
            .year-list ul, .cta-grid { grid-template-columns: 1fr; }
        }
        .officer-role {
            font-size: 0.73rem;
            font-weight: 800;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--ink-60);
            margin-bottom: 0.25rem;
        }
      `}</style>

      <Nav brandHref="/es" links={navLinks} toggleLabel="Alternar menú" />

      {/* Hero */}
      <header className="hero" id="top">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="https://d3id26kdqbehod.cloudfront.net/NICSHS/2025/11/18/FZj47wpVlGiXWQNp4yVTVFyh8ueE90fgdgpzn2tHVk4D5eRFByiktvlLYHCJ/Senn+Broll_Drone_Exterior-480p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-veil"></div>
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-inner">
              <Shield
                className="hero-shield"
                outer="#D4A017"
                inner="#1B5E20"
                letter="#D4A017"
              />
              <h1>Senn Parents</h1>
              <p className="tagline">Liderado por padres. Por nuestros hijos.</p>
              <p className="hero-sub">
                Construyendo conexiones más fuertes entre familias, personal y
                las decisiones que dan forma a la educación de nuestros hijos.
              </p>
              <div className="hero-actions">
                <Link href="/survey?lang=es" className="btn btn-gold">
                  Tome la Encuesta para Padres 2026-27{" "}
                  <span className="arrow">&rarr;</span>
                </Link>
                <Link href="/unase" className="btn btn-line">
                  Conviértase en Miembro
                </Link>
              </div>
            </div>

            <aside className="next-up">
              <p className="kicker">Próxima reunión</p>
              {next ? (
                <>
                  <div className="day">{nextDay}</div>
                  <div className="mon">
                    {nextMon} {next.date.slice(0, 4)}
                  </div>
                  <h3>Reunión General del CAP</h3>
                  <p className="where">
                    {next.location ?? "Lugar por confirmar"} &middot;
                    7:00&ndash;8:00 PM (hora central)
                  </p>
                </>
              ) : (
                <h3>Pronto publicaremos las fechas del próximo año</h3>
              )}
              <span className="src">
                <span className="dot" style={{ background: "var(--gold)" }}></span>
                CAP de Senn
              </span>
              <a href="#meeting" className="btn btn-gold">
                Detalles de la reunión
              </a>
            </aside>
          </div>

          {/* Momentum */}
          <div className="signal">
            <div>
              <strong>100+</strong>
              <span>Familias Encuestadas</span>
            </div>
            <div>
              <strong>85+</strong>
              <span>Padres Conectados</span>
            </div>
            <div>
              <strong>5+</strong>
              <span>Idiomas Representados</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Oficiales Electos</span>
            </div>
          </div>
        </div>
      </header>

      {/* What is the PAC */}
      <section id="about">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Acerca de</p>
              <h2>¿Qué es el CAP?</h2>
              <p className="lede">
                El Consejo Asesor de Padres es un organismo liderado por padres
                en cada escuela del Título I. Existe para asegurar que las
                voces de los padres influyan en cómo la escuela invierte en la
                participación familiar.
              </p>
            </div>
          </div>

          <div className="notices">
            <div className="notice">
              <div className="what-icon">&#128176;</div>
              <h3>Recomendaciones de Presupuesto</h3>
              <p>Asesoramos sobre cómo se gasta el presupuesto de participación de padres del Título I de la escuela.</p>
            </div>
            <div className="notice">
              <div className="what-icon">&#128221;</div>
              <h3>Política de Participación de Padres</h3>
              <p>Co-desarrollamos la política de participación de padres con la administración.</p>
            </div>
            <div className="notice">
              <div className="what-icon">&#127891;</div>
              <h3>Talleres y Recursos</h3>
              <p>Organizamos talleres y recursos para las familias.</p>
            </div>
            <div className="notice">
              <div className="what-icon">&#129309;</div>
              <h3>Pacto Escuela-Padres</h3>
              <p>Creamos el acuerdo entre las familias y la escuela sobre las responsabilidades compartidas.</p>
            </div>
            <div className="notice">
              <div className="what-icon">&#9878;&#65039;</div>
              <h3>Sus Derechos</h3>
              <p>Conectamos a los padres con información sobre sus derechos bajo la ley federal de educación.</p>
            </div>
          </div>

          <p className="pac-note">
            El CAP es liderado por padres, para padres. Somos independientes de
            la administración escolar.
          </p>
        </div>
      </section>

      {/* Become a member */}
      <section>
        <div className="wrap">
          <div className="join">
            <div className="join-grid">
              <div className="join-copy">
                <p className="eyebrow">Comience aquí</p>
                <h2>Conviértase en Miembro del CAP</h2>
                <p>
                  Aprenda cómo funciona el Título I, entienda su rol como padre
                  y regístrese como miembro. Toma aproximadamente 5 minutos.
                </p>
                <p>
                  Todos los padres y tutores son bienvenidos. No necesita ser
                  miembro para asistir a una reunión.
                </p>
              </div>
              <div className="join-card">
                <p className="picked">
                  La Guía del CAP: 7 pasos cortos, desde qué es el Título I
                  hasta su nombre en la lista de miembros.
                </p>
                <Link
                  href="/unase"
                  className="btn btn-green"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Comenzar la Guía del CAP <span className="arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next meeting */}
      <section id="meeting" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Próximamente</p>
              <h2>Próxima Reunión del CAP</h2>
              <p className="lede">
                Todos los padres y tutores son bienvenidos. No necesita ser
                miembro para asistir.
              </p>
            </div>
          </div>

          <div className="cal">
            {next ? (
              <div className="cal-row">
                <div className="cal-when">
                  <b>{nextDay}</b>
                  <span>{nextMon}</span>
                </div>
                <div className="cal-what">
                  <h3>Reunión General del CAP</h3>
                  <div className="cal-meta">
                    <span className="src">
                      <span className="dot"></span>CAP de Senn
                    </span>
                    <span>
                      {fmtPacDate(next.date, "es-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>7:00&ndash;8:00 PM (hora central)</span>
                    <span>
                      {next.location ?? (
                        <>
                          Lugar por confirmar. El lugar y el enlace para unirse
                          se comparten la semana anterior, en la{" "}
                          <a
                            href="https://www.sennhs.org/apps/events/"
                            target="_blank"
                            rel="noopener"
                            style={{ color: "var(--green-mid)", fontWeight: 600 }}
                          >
                            página de eventos de Senn
                          </a>
                          .
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="cal-acts">
                  <a
                    href={pacGcalLink(next, CAL_TITLE, CAL_DETAILS)}
                    className="btn btn-quiet"
                    target="_blank"
                    rel="noopener"
                  >
                    Agregar al Calendario
                  </a>
                  <Link href="/minutes" className="btn btn-quiet">
                    Actas Anteriores
                  </Link>
                </div>
              </div>
            ) : (
              <div className="cal-row">
                <p className="lede">
                  Así termina el año escolar 2026&ndash;27. Pronto publicaremos
                  las fechas del próximo año.
                </p>
              </div>
            )}
            <div className="year-list">
              <h3>Fechas de Reuniones 2026&ndash;27</h3>
              <p className="year-note">
                Todas las reuniones son los martes, de 7:00 a 8:00 PM (hora
                central).
              </p>
              <ul>
                {PAC_MEETINGS.map((m) => {
                  const past = m.date < today;
                  const isNext = m === next;
                  return (
                    <li
                      key={m.date}
                      className={isNext ? "next" : past ? "past" : undefined}
                    >
                      <span className="yl-date">
                        {fmtPacDate(m.date, "es-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {isNext ? (
                        <span className="yl-tag">Próxima</span>
                      ) : past ? (
                        <span className="yl-tag done">Hecha</span>
                      ) : (
                        <a
                          className="yl-add"
                          href={pacGcalLink(m, CAL_TITLE, CAL_DETAILS)}
                          target="_blank"
                          rel="noopener"
                        >
                          + Agregar
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <a href={PAC_ICS} className="btn btn-gold year-all">
                Agregar Todas las Reuniones a Mi Calendario
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Officers */}
      <section id="officers">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Liderazgo</p>
              <h2>Sus Oficiales 2025&ndash;2026</h2>
              <p className="lede">
                Elegidos por los padres de Senn para representar su voz en cómo
                la escuela invierte en la participación familiar.
              </p>
            </div>
          </div>
          <div className="donors">
            <div className="donor">
              <div className="officer-role">Presidente</div>
              <b>Jason Menard</b>
            </div>
            <div className="donor">
              <div className="officer-role">Vicepresidente</div>
              <b>Katie Denny</b>
            </div>
            <div className="donor">
              <div className="officer-role">Secretaria</div>
              <b>Kathryn Clark</b>
            </div>
            <div className="donor">
              <div className="officer-role">Coordinador de Alcance</div>
              <b>Steve Larosiliere</b>
            </div>
          </div>
        </div>
      </section>

      {/* Survey results */}
      <section id="survey" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Su Voz Importa</p>
              <h2>Nuevo Año Escolar, Nueva Encuesta</h2>
            </div>
          </div>
          <div className="cta-grid">
            <div className="cta-card">
              <h3>Tome la Encuesta para Padres 2026-27</h3>
              <p>
                Dos minutos, en español o inglés. Díganos qué necesita su
                familia este año. Sus respuestas deciden qué talleres organiza
                el CAP y cómo se gastan los fondos de Título I para la
                participación familiar.
              </p>
              <Link href="/survey?lang=es" className="btn btn-gold">
                Tomar la Encuesta
              </Link>
            </div>
            <div className="cta-card">
              <h3>El Año Pasado Respondieron Más de 100 Familias</h3>
              <p>
                Las principales prioridades fueron planificación universitaria,
                salud mental y Conozca Sus Derechos. Vea lo que las familias nos
                dijeron en 2025-26.
              </p>
              <Link href="/vota" className="btn btn-quiet">
                Ver Resultados 2025-26
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="wrap">
          <div className="about-grid">
            <div>
              <p className="eyebrow">Contacto</p>
              <h2>Comuníquese con el CAP</h2>
              <p className="lede" style={{ marginTop: "1rem" }}>
                ¿Preguntas, ideas o quiere participar? Envíenos un correo
                electrónico y un padre le responderá.
              </p>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
                <a href="mailto:sennparents@gmail.com" className="btn btn-quiet">
                  sennparents@gmail.com
                </a>
                <Link href="/unase" className="btn btn-quiet">
                  Únase al CAP <span className="arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang="es" />
    </>
  );
}
