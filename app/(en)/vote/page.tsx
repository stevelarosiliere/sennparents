import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vote | Senn Parents PAC",
  description:
    "100+ Senn families told us what matters most. Now vote on the first workshop the PAC should organize with Title I funds.",
  openGraph: {
    title: "Vote for Our First Workshop | Senn Parents PAC",
    description:
      "100+ families responded. Now help us decide what to do first with Title I funds.",
    type: "website",
    url: "https://sennparents.com/vote",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#meeting", label: "Next Meeting" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/vota", label: "Español" },
  { href: "/join", label: "Join", pill: true },
];

export default function VotePage() {
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

        /* By the numbers */
        .num-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2.5rem;
        }
        .num {
            background: var(--green-soft);
            border-radius: var(--r);
            padding: 1.4rem 1rem;
            text-align: center;
        }
        .num b {
            display: block;
            font-size: 2rem;
            font-weight: 900;
            color: var(--green);
            line-height: 1.1;
        }
        .num span { font-size: 0.85rem; color: var(--ink-60); }

        .bar-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .bar-col h3 { font-size: 1.08rem; margin-bottom: 1rem; }
        .bar-row { margin-bottom: 0.9rem; }
        .bar-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.88rem;
            margin-bottom: 0.35rem;
        }
        .bar-label span { color: var(--ink-60); }
        .bar-label strong { color: var(--ink); font-weight: 800; }
        .bar-track {
            height: 10px;
            background: var(--bone);
            border-radius: 999px;
            box-shadow: inset 0 0 0 1px var(--line);
            overflow: hidden;
        }
        .bar-fill {
            height: 100%;
            background: var(--green);
            border-radius: 999px;
        }

        .survey-note {
            margin-top: 2rem;
            padding: 1.1rem 1.3rem;
            background: var(--gold-soft);
            border-radius: var(--r);
            font-weight: 600;
            color: var(--green);
            font-size: 0.95rem;
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
        @media (max-width: 900px) {
            .num-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 780px) {
            .bar-cols { grid-template-columns: 1fr; gap: 1.75rem; }
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

      <Nav links={navLinks} />

      {/* Hero */}
      <header className="hero">
        <div className="wrap">
          <div className="vote-hero-inner">
            <h1>
              You Spoke. <span>We Listened.</span>
            </h1>
            <p>
              At Report Card Pick-Up, we asked Senn families what matters most.
              The response was incredible.
            </p>
            <div className="stat-banner">
              <div className="stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Families responded</div>
              </div>
              <div className="stat">
                <div className="stat-number">4</div>
                <div className="stat-label">Grade levels represented</div>
              </div>
              <div className="stat">
                <div className="stat-number">5+</div>
                <div className="stat-label">Languages spoken</div>
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
              <p className="eyebrow">Survey Results</p>
              <h2>What Families Said Matters Most</h2>
              <p className="lede">
                These were the top priorities Senn parents chose when asked what
                the PAC should focus on this year.
              </p>
            </div>
          </div>

          <div className="notices">
            <div className="notice result-card">
              <span className="result-badge">#1 Priority</span>
              <div className="result-icon">&#127891;</div>
              <h4>College &amp; Career Planning</h4>
              <p>
                Help with college applications, FAFSA, financial aid, and career
                pathways
              </p>
            </div>
            <div className="notice result-card">
              <span className="result-badge">#2 Priority</span>
              <div className="result-icon">&#128154;</div>
              <h4>Mental Health &amp; Well-Being</h4>
              <p>
                Supporting students&apos; emotional health and learning how to
                recognize warning signs
              </p>
            </div>
            <div className="notice result-card">
              <span className="result-badge">#3 Priority</span>
              <div className="result-icon">&#9878;&#65039;</div>
              <h4>Know Your Rights</h4>
              <p>
                Immigration, housing, and special education rights workshops for
                families
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">By the Numbers</p>
              <h2>What the Survey Told Us</h2>
            </div>
          </div>

          <div className="num-grid">
            <div className="num">
              <b>85+</b>
              <span>Email addresses collected</span>
            </div>
            <div className="num">
              <b>85+</b>
              <span>Phone numbers collected</span>
            </div>
            <div className="num">
              <b>85%</b>
              <span>Want to stay connected</span>
            </div>
            <div className="num">
              <b>7x</b>
              <span>More responses than last year</span>
            </div>
          </div>

          <div className="bar-cols">
            <div className="bar-col">
              <h3>What Makes It Hard to Participate?</h3>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Work schedule</span>
                  <strong>80%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Unaware of events</span>
                  <strong>30%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "30%" }}></div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Childcare</span>
                  <strong>25%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
            <div className="bar-col">
              <h3>When Can You Attend?</h3>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Weekday evenings</span>
                  <strong>50%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "50%" }}></div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Weekday mornings</span>
                  <strong>40%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Saturday mornings</span>
                  <strong>35%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">
                  <span>Virtual options</span>
                  <strong>30%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "30%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <p className="survey-note">
            45% of parents had never heard of the PAC before Report Card
            Pick-Up. Now 85% want to stay connected. Your voice is building
            something real.
          </p>
        </div>
      </section>

      {/* Vote */}
      <section id="vote">
        <div className="wrap">
          <div className="needs">
            <div className="sec-head" style={{ marginBottom: "1.5rem" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--green-mid)" }}>
                  Your Vote
                </p>
                <h2>Help Us Decide What Happens First</h2>
                <p className="lede">
                  The PAC has Title I funds to invest in parent workshops before
                  the school year ends on June 4. Based on what you told us,
                  here are four options. Pick the one you want most.
                </p>
              </div>
            </div>

            <div className="vote-options">
              <div className="vote-option">
                <div className="vote-option-icon">&#127891;</div>
                <h4>College &amp; FAFSA Planning Night</h4>
                <p>
                  Help your student prepare for college applications, financial
                  aid, and career paths. A trained facilitator walks parents
                  through the process step by step.
                </p>
                <span className="tag-pill">CPS-approved vendor delivered</span>
              </div>
              <div className="vote-option">
                <div className="vote-option-icon">&#128154;</div>
                <h4>Mental Health &amp; Wellness Workshop</h4>
                <p>
                  Learn how to support your student&apos;s emotional well-being,
                  recognize warning signs, and connect with resources. Led by a
                  licensed wellness provider.
                </p>
                <span className="tag-pill">CPS-approved vendor delivered</span>
              </div>
              <div className="vote-option">
                <div className="vote-option-icon">&#9878;&#65039;</div>
                <h4>Know Your Rights Session</h4>
                <p>
                  Immigration rights, housing protections, and special education
                  advocacy. Know what your family is entitled to. Bilingual
                  facilitation available.
                </p>
                <span className="tag-pill">CPS-approved vendor delivered</span>
              </div>
              <div className="vote-option">
                <div className="vote-option-icon">&#127917;</div>
                <h4>Family Community Celebration</h4>
                <p>
                  An evening of food, art, music, and connection for Senn
                  families. A chance to meet other parents and build community
                  together.
                </p>
                <span className="tag-pill">CPS-approved vendor delivered</span>
              </div>
            </div>

            <div className="vote-cta">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdMUxPGi3rqb4BDfZ0vrk2LpfOVjYcP-e_xwZhJRMCsJk44xA/viewform"
                className="btn btn-green"
                target="_blank"
                rel="noopener"
              >
                Cast Your Vote <span className="arrow">&rarr;</span>
              </a>
              <p className="fine">Takes 10 seconds. One vote per family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">The Process</p>
              <h2>How Your Vote Becomes Action</h2>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-step">
              <div className="timeline-dot done">&#10003;</div>
              <div>
                <strong>Survey</strong>
                <p>100+ families shared priorities</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot done">&#10003;</div>
              <div>
                <strong>Results</strong>
                <p>Top themes identified</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot active">3</div>
              <div>
                <strong>Vote Now</strong>
                <p>You pick the first workshop</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot">4</div>
              <div>
                <strong>April 21</strong>
                <p>Results shared at PAC meeting</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot">5</div>
              <div>
                <strong>May</strong>
                <p>Workshop happens at Senn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Reminder */}
      <section>
        <div className="wrap">
          <div className="join meeting-band">
            <h2>Next PAC Meeting</h2>
            <p>Join us to hear the vote results and help plan the workshop.</p>
            <div className="meeting-details-inline">
              <div>
                &#128197; <strong>Tuesday, April 21, 2026</strong>
              </div>
              <div>
                &#128336; <strong>7:00&ndash;8:30 PM CT</strong>
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
                  Virtual option: Join via Zoom
                </a>
              </div>
            </div>
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Senn+PAC+Meeting&dates=20260422T000000Z/20260422T013000Z&details=Parent+Advisory+Council+Meeting%0ALittle+Red+Nest%0A%0AZoom%3A+https%3A%2F%2Fus06web.zoom.us%2Fj%2F8611443771%0A%0AAgenda%3A+Workshop+Vote+Results%2C+Title+I+Fund+Planning&location=Little+Red+Nest%2C+5456+N.+Ashland+Ave%2C+Chicago+IL+60640"
              className="btn btn-line"
              target="_blank"
              rel="noopener"
            >
              Add to Calendar
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
