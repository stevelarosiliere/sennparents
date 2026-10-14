import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Shield from "@/components/Shield";

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
  { href: "/vota", label: "Vote" },
  { href: "#about", label: "Acerca de" },
  { href: "/", label: "English" },
  { href: "/unase", label: "Únase", pill: true },
];

export default function EsHomePage() {
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
                <Link href="/unase" className="btn btn-gold">
                  Conviértase en Miembro <span className="arrow">&rarr;</span>
                </Link>
                <Link href="/vota" className="btn btn-line">
                  Vote por Nuestro Primer Taller
                </Link>
              </div>
            </div>

            <aside className="next-up">
              <p className="kicker">Próxima reunión</p>
              <div className="day">19</div>
              <div className="mon">Mayo 2026</div>
              <h3>Reunión General del CAP</h3>
              <p className="where">
                Little Red Nest &middot; 7:00&ndash;8:30 PM (hora central)
              </p>
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
            <div className="cal-row">
              <div className="cal-when">
                <b>19</b>
                <span>Mayo</span>
              </div>
              <div className="cal-what">
                <h3>Reunión General del CAP</h3>
                <div className="cal-meta">
                  <span className="src">
                    <span className="dot"></span>CAP de Senn
                  </span>
                  <span>7:00&ndash;8:30 PM (hora central)</span>
                  <span>Little Red Nest, 5456 N. Ashland Ave, Chicago, IL 60640</span>
                  <span>
                    <a
                      href="https://us06web.zoom.us/j/8611443771"
                      target="_blank"
                      rel="noopener"
                      style={{ color: "var(--green-mid)", fontWeight: 600 }}
                    >
                      Únase por Zoom
                    </a>{" "}
                    (esta reunión será grabada)
                  </span>
                </div>
              </div>
              <div className="cal-acts">
                <a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Senn+PAC+Meeting&dates=20260520T000000Z/20260520T013000Z&details=Reuni%C3%B3n+del+Consejo+Asesor+de+Padres%0ANicholas+Senn+High+School%0A%0AZoom%3A+https%3A%2F%2Fus06web.zoom.us%2Fj%2F8611443771%0A%0AAgenda%3A+actas+de+abril%2C+aprobaci%C3%B3n+de+laptop+y+gabinete%2C+actualizaciones+de+talleres%2C+d%C3%ADa+de+voluntariado+en+la+biblioteca&location=Little+Red+Nest%2C+5456+N.+Ashland+Ave%2C+Chicago+IL+60640"
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
            <div className="agenda">
              <h3>Puntos Destacados de la Agenda</h3>
              <ul>
                <li>Llamado al orden, asistencia y quórum</li>
                <li>Aceptar las actas de la reunión de abril 2026</li>
                <li>Cotizaciones de laptop y gabinete &mdash; revisión y aprobación</li>
                <li>Actualizaciones de talleres</li>
                <li>Actualización del día de voluntariado en la biblioteca</li>
                <li>Nuevos asuntos, preguntas y comentarios</li>
              </ul>
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
          <div className="needs">
            <div className="sec-head" style={{ marginBottom: "1.5rem" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--green-mid)" }}>
                  Su Voz Importa
                </p>
                <h2>Los Resultados de la Encuesta 2026 Están Aquí</h2>
                <p className="lede">
                  Más de 100 familias nos dijeron qué es lo más importante. Las
                  principales prioridades: planificación universitaria, salud
                  mental y Conozca Sus Derechos. Ahora ayúdenos a decidir qué
                  taller sucede primero.
                </p>
              </div>
            </div>
            <Link href="/vota" className="btn btn-green" style={{ width: "auto" }}>
              Ver Resultados y Votar <span className="arrow">&rarr;</span>
            </Link>
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
