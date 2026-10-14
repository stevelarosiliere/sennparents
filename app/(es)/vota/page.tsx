import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vote | Senn Parents CAP",
  description:
    "Más de 100 familias de Senn nos dijeron qué es lo más importante. Ahora vote por el primer taller que el CAP debe organizar con fondos del Título I.",
  openGraph: {
    title: "Vote por Nuestro Primer Taller | Senn Parents CAP",
    description:
      "Más de 100 familias respondieron. Ahora ayúdenos a decidir qué hacer primero con los fondos del Título I.",
    type: "website",
    url: "https://sennparents.com/vota",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

const navLinks = [
  { href: "/es", label: "Inicio" },
  { href: "/es#meeting", label: "Próxima Reunión" },
  { href: "/es#about", label: "Acerca de" },
  { href: "/es#contact", label: "Contacto" },
  { href: "/vote", label: "English" },
  { href: "/unase", label: "Únase", pill: true },
];

export default function VotaPage() {
  return (
    <>
      <style>{`
        /* Hero */
        .vote-hero-inner {
            text-align: center;
            max-width: 760px;
            margin: 0 auto;
        }
        .vote-hero-inner h1 span { color: var(--gold); }
        .vote-hero-inner p {
            margin-left: auto;
            margin-right: auto;
        }

        .stat-banner {
            display: flex;
            justify-content: center;
            gap: 2.5rem;
            flex-wrap: wrap;
            margin-top: 2.5rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.18);
        }
        .stat { text-align: center; }
        .stat-number {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--gold);
            line-height: 1.1;
        }
        .stat-label {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.72);
            margin-top: 0.25rem;
        }

        /* Survey result cards */
        .result-card { text-align: center; align-items: center; }
        .result-badge {
            display: inline-block;
            background: var(--gold-soft);
            color: var(--green);
            font-weight: 800;
            font-size: 0.72rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.3rem 0.85rem;
            border-radius: 999px;
        }
        .result-icon { font-size: 2rem; }
        .result-card h4, .vote-option h4 {
            font-size: 1.05rem;
            font-weight: 800;
            letter-spacing: -0.015em;
            line-height: 1.25;
            margin-bottom: 0.15rem;
        }

        /* Vote options in the gold band */
        .vote-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.1rem;
            margin-bottom: 2rem;
        }
        .vote-option {
            background: var(--white);
            border-radius: var(--r);
            padding: 1.5rem;
            border-left: 6px solid var(--green-mid);
        }
        .vote-option-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .vote-option p { font-size: 0.9rem; color: var(--ink-60); margin-top: 0.35rem; }
        .vote-option .tag-pill { display: inline-block; margin-top: 0.75rem; }
        .vote-cta { text-align: center; }
        .vote-cta .fine { margin-top: 0.85rem; font-size: 0.85rem; color: var(--ink-60); }

        /* Timeline */
        .timeline {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 2.5rem;
            position: relative;
            max-width: 760px;
            margin-left: auto;
            margin-right: auto;
        }
        .timeline::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 10%;
            right: 10%;
            height: 3px;
            border-radius: 999px;
            background: var(--line);
        }
        .timeline-step {
            text-align: center;
            position: relative;
            z-index: 1;
            flex: 1;
        }
        .timeline-dot {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--white);
            color: var(--ink-60);
            box-shadow: inset 0 0 0 1.5px var(--line);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.9rem;
            margin: 0 auto 0.6rem;
        }
        .timeline-dot.done {
            background: var(--gold);
            color: var(--ink);
            box-shadow: none;
        }
        .timeline-dot.active {
            background: var(--green);
            color: var(--white);
            box-shadow: 0 0 0 4px var(--gold-soft), 0 0 0 6px var(--gold);
        }
        .timeline-step strong { font-size: 0.9rem; color: var(--ink); }
        .timeline-step p {
            font-size: 0.82rem;
            color: var(--ink-60);
            max-width: 130px;
            margin: 0 auto;
        }

        /* Meeting reminder band */
        .meeting-band { text-align: center; }
        .meeting-band > * { position: relative; z-index: 2; }
        .meeting-band p {
            color: rgba(255,255,255,0.82);
            max-width: 52ch;
            margin: 0.75rem auto 1.5rem;
        }
        .meeting-details-inline {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            margin-bottom: 1.25rem;
        }
        .meeting-details-inline div {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.05rem;
        }
        .meeting-band .btn { margin-top: 0.75rem; }

        /* Responsive */
        @media (max-width: 780px) {
            .vote-options { grid-template-columns: 1fr; }
            .stat-banner { gap: 1.75rem; }
            .timeline { flex-direction: column; gap: 1.25rem; }
            .timeline::before { display: none; }
            .timeline-step { display: flex; align-items: center; gap: 0.85rem; text-align: left; }
            .timeline-step p { max-width: none; margin: 0; }
            .timeline-dot { margin: 0; flex-shrink: 0; }
            .meeting-details-inline { flex-direction: column; align-items: center; gap: 0.75rem; }
        }
        @media (max-width: 480px) {
            .stat-number { font-size: 2rem; }
        }
      `}</style>

      <Nav brandHref="/es" toggleLabel="Alternar menú" links={navLinks} />

      {/* Hero */}
      <header className="hero">
        <div className="wrap">
          <div className="vote-hero-inner">
            <h1>
              Ustedes Hablaron. <span>Los Escuchamos.</span>
            </h1>
            <p>
              En la Entrega de Calificaciones, preguntamos a las familias de
              Senn qué es lo más importante. La respuesta fue increíble.
            </p>
            <div className="stat-banner">
              <div className="stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Familias respondieron</div>
              </div>
              <div className="stat">
                <div className="stat-number">4</div>
                <div className="stat-label">Grados representados</div>
              </div>
              <div className="stat">
                <div className="stat-number">5+</div>
                <div className="stat-label">Idiomas hablados</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* What Parents Said */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Resultados de la Encuesta</p>
              <h2>Lo Que las Familias Dijeron Que Más Importa</h2>
              <p className="lede">
                Estas fueron las principales prioridades que los padres de Senn
                eligieron cuando se les preguntó en qué debería enfocarse el CAP
                este año.
              </p>
            </div>
          </div>

          <div className="notices">
            <div className="notice result-card">
              <span className="result-badge">Prioridad #1</span>
              <div className="result-icon">&#127891;</div>
              <h4>Planificación Universitaria y Profesional</h4>
              <p>
                Ayuda con solicitudes universitarias, FAFSA, ayuda financiera y
                caminos profesionales
              </p>
            </div>
            <div className="notice result-card">
              <span className="result-badge">Prioridad #2</span>
              <div className="result-icon">&#128154;</div>
              <h4>Salud Mental y Bienestar</h4>
              <p>
                Apoyar la salud emocional de los estudiantes y aprender a
                reconocer señales de alerta
              </p>
            </div>
            <div className="notice result-card">
              <span className="result-badge">Prioridad #3</span>
              <div className="result-icon">&#9878;&#65039;</div>
              <h4>Conozca Sus Derechos</h4>
              <p>
                Talleres sobre derechos de inmigración, vivienda y educación
                especial para familias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vote */}
      <section id="vote">
        <div className="wrap">
          <div className="needs">
            <div className="sec-head" style={{ marginBottom: "1.5rem" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--green-mid)" }}>
                  Su Voto
                </p>
                <h2>Ayúdenos a Decidir Qué Sucede Primero</h2>
                <p className="lede">
                  El CAP tiene fondos del Título I para invertir en talleres
                  para padres antes de que termine el año escolar el 4 de junio.
                  Según lo que nos dijeron, aquí hay cuatro opciones. Elija la
                  que más desee.
                </p>
              </div>
            </div>

            <div className="vote-options">
              <div className="vote-option">
                <div className="vote-option-icon">&#127891;</div>
                <h4>Noche de Planificación Universitaria y FAFSA</h4>
                <p>
                  Ayude a su estudiante a prepararse para solicitudes
                  universitarias, ayuda financiera y caminos profesionales. Un
                  facilitador capacitado guía a los padres paso a paso.
                </p>
                <span className="tag-pill">Proveedor aprobado por CPS</span>
              </div>
              <div className="vote-option">
                <div className="vote-option-icon">&#128154;</div>
                <h4>Taller de Salud Mental y Bienestar</h4>
                <p>
                  Aprenda cómo apoyar el bienestar emocional de su estudiante,
                  reconocer señales de alerta y conectarse con recursos.
                  Dirigido por un proveedor de bienestar certificado.
                </p>
                <span className="tag-pill">Proveedor aprobado por CPS</span>
              </div>
              <div className="vote-option">
                <div className="vote-option-icon">&#9878;&#65039;</div>
                <h4>Sesión Conozca Sus Derechos</h4>
                <p>
                  Derechos de inmigración, protecciones de vivienda y defensa de
                  educación especial. Conozca a qué tiene derecho su familia.
                  Facilitación bilingüe disponible.
                </p>
                <span className="tag-pill">Proveedor aprobado por CPS</span>
              </div>
              <div className="vote-option">
                <div className="vote-option-icon">&#127917;</div>
                <h4>Celebración Comunitaria Familiar</h4>
                <p>
                  Una noche de comida, arte, música y conexión para las familias
                  de Senn. Una oportunidad para conocer a otros padres y
                  construir comunidad juntos.
                </p>
                <span className="tag-pill">Proveedor aprobado por CPS</span>
              </div>
            </div>

            <div className="vote-cta">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdMUxPGi3rqb4BDfZ0vrk2LpfOVjYcP-e_xwZhJRMCsJk44xA/viewform"
                className="btn btn-green"
                target="_blank"
                rel="noopener"
              >
                Emita Su Voto <span className="arrow">&rarr;</span>
              </a>
              <p className="fine">Toma 10 segundos. Un voto por familia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">El Proceso</p>
              <h2>Cómo Su Voto Se Convierte en Acción</h2>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-step">
              <div className="timeline-dot done">&#10003;</div>
              <div>
                <strong>Encuesta</strong>
                <p>100+ familias compartieron prioridades</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot done">&#10003;</div>
              <div>
                <strong>Resultados</strong>
                <p>Temas principales identificados</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot active">3</div>
              <div>
                <strong>Vote Ahora</strong>
                <p>Usted elige el primer taller</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot">4</div>
              <div>
                <strong>21 de Abril</strong>
                <p>Resultados en la reunión del CAP</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot">5</div>
              <div>
                <strong>Mayo</strong>
                <p>El taller se realiza en Senn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Reminder */}
      <section>
        <div className="wrap">
          <div className="join meeting-band">
            <h2>Próxima Reunión del CAP</h2>
            <p>
              Únase a nosotros para escuchar los resultados de la votación y
              ayudar a planificar el taller.
            </p>
            <div className="meeting-details-inline">
              <div>
                &#128197; <strong>Martes, 21 de abril de 2026</strong>
              </div>
              <div>
                &#128336; <strong>7:00&ndash;8:30 PM (hora central)</strong>
              </div>
            </div>
            <div className="meeting-details-inline">
              <div>
                &#128205; <strong>Little Red Nest</strong>, 5456 N. Ashland Ave,
                Chicago, IL 60640
              </div>
            </div>
            <div className="meeting-details-inline">
              <div>
                &#128187;{" "}
                <a
                  href="https://us06web.zoom.us/j/8611443771"
                  style={{ color: "var(--gold)" }}
                  target="_blank"
                  rel="noopener"
                >
                  Opción virtual: Únase por Zoom
                </a>
              </div>
            </div>
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Senn+PAC+Meeting&dates=20260422T000000Z/20260422T013000Z&details=Parent+Advisory+Council+Meeting%0ALittle+Red+Nest%0A%0AZoom%3A+https%3A%2F%2Fus06web.zoom.us%2Fj%2F8611443771%0A%0AAgenda%3A+Workshop+Vote+Results%2C+Title+I+Fund+Planning&location=Little+Red+Nest%2C+5456+N.+Ashland+Ave%2C+Chicago+IL+60640"
              className="btn btn-line"
              target="_blank"
              rel="noopener"
            >
              Agregar al Calendario
            </a>
          </div>
        </div>
      </section>

      <Footer lang="es" />
    </>
  );
}
