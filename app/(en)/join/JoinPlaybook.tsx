"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Shield from "@/components/Shield";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#meeting", label: "Next Meeting" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/unase", label: "Español" },
  { href: "/vote", label: "Vote", pill: true },
];

const TOTAL_SCREENS = 7;

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxoARfseF_T4vG7df09vjoeN5BSBcdZjd3ZQjimNZLP0vM-fepHndSbDbAwgkk2iLUj/exec";

export default function JoinPlaybook() {
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
        "Something went wrong. Please try again or email sennparents@gmail.com."
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

      <Nav links={navLinks} />

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
                Before You Join,
                <br />
                <em>Get to Know the PAC</em>
              </h1>
              <p className="intro-lede">
                This quick walkthrough covers how Title I funding works, what the
                PAC does, and what Senn parents are telling us. Takes about 5
                minutes. At the end, you can register as a member.
              </p>

              <div className="intro-grid">
                <div className="intro-cell">
                  <div className="cell-icon">&#128176;</div>
                  <p>How Title I funds work at Senn</p>
                </div>
                <div className="intro-cell">
                  <div className="cell-icon">&#128221;</div>
                  <p>What the PAC can spend money on</p>
                </div>
                <div className="intro-cell">
                  <div className="cell-icon">&#128172;</div>
                  <p>What 100+ families said matters most</p>
                </div>
                <div className="intro-cell">
                  <div className="cell-icon">&#129309;</div>
                  <p>How to have a voice in your child&apos;s education</p>
                </div>
              </div>

              <button className="btn btn-gold" onClick={() => setStarted(true)}>
                Let&apos;s Go <span className="arrow">&rarr;</span>
              </button>
              <p className="intro-note">7 short screens. No account needed.</p>
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
            Step {currentScreen} of {TOTAL_SCREENS}
          </div>
        </div>

        {/* Screen 1: What is Title I? */}
        <div className={currentScreen === 1 ? "screen active" : "screen"} data-screen="1">
          <div className="screen-content">
            <p className="eyebrow">The Basics</p>
            <h1>What is Title I?</h1>
            <div className="content-block">
              <p>
                Title I provides federal funds to ensure all children have equal
                opportunity to a quality education.
              </p>
              <p>
                The law has existed since 1965. The current version is called
                ESSA (Every Student Succeeds Act).
              </p>
              <p>
                Any school receiving Title I funds must set aside 1% of their
                allocation for Parent and Family Engagement.
              </p>
            </div>
            <div className="highlight-box">
              Senn High School is a Title I school. That means there are funds
              specifically for parent programming.
            </div>
          </div>
          <div className="screen-nav">
            <div></div>
            <button className="btn btn-gold" onClick={() => goToScreen(2)}>
              Get Started <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 2: Why Does Parent Engagement Matter? */}
        <div className={currentScreen === 2 ? "screen active" : "screen"} data-screen="2">
          <div className="screen-content">
            <p className="eyebrow">Why It Matters</p>
            <h1>Why Does Parent Engagement Matter?</h1>
            <div className="content-block">
              <p>
                Studies show that when parents are involved in their
                child&apos;s school, students perform better socially and
                academically.
              </p>
              <ul>
                <li>
                  Parents have the opportunity to advise the principal about
                  parent needs.
                </li>
                <li>Parents learn about their student&apos;s academic needs.</li>
                <li>
                  Parents drive spending for trainings that develop their skills
                  to help their children academically.
                </li>
              </ul>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(1)}>
              Back
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(3)}>
              Next <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 3: What Can PAC Funds Be Spent On? */}
        <div className={currentScreen === 3 ? "screen active" : "screen"} data-screen="3">
          <div className="screen-content">
            <p className="eyebrow">The Budget</p>
            <h1>What Can PAC Funds Be Spent On?</h1>
            <div className="content-block">
              <p>
                Title I parent engagement funds have specific rules about how
                they can be used.
              </p>
            </div>
            <div className="cards-grid">
              <div className="info-card">
                <div className="card-icon">&#127891;</div>
                <h4>Workshops &amp; Trainings</h4>
                <p>For parent skills building to support your child academically</p>
              </div>
              <div className="info-card">
                <div className="card-icon">&#9749;</div>
                <h4>Refreshments</h4>
                <p>Up to 25% of PAC funds can be spent on light refreshments for events</p>
              </div>
              <div className="info-card">
                <div className="card-icon">&#128186;</div>
                <h4>Furniture &amp; Equipment</h4>
                <p>Must be for parents only. Cannot be used by staff or students.</p>
              </div>
              <div className="info-card">
                <div className="card-icon">&#128203;</div>
                <h4>Office Supplies</h4>
                <p>Can only be used for PAC business</p>
              </div>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(2)}>
              Back
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(4)}>
              Next <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 4: What is the PAC? */}
        <div className={currentScreen === 4 ? "screen active" : "screen"} data-screen="4">
          <div className="screen-content">
            <p className="eyebrow">Your Council</p>
            <h1>What is the PAC?</h1>
            <div className="content-block">
              <p>
                The Parent Advisory Council is a parent-led body at every Title
                I school. It exists to make sure parent voices shape how the
                school invests in family engagement.
              </p>
              <p>The PAC is independent of school administration.</p>
              <ul>
                <li>We recommend how Title I parent engagement funds are spent.</li>
                <li>We co-develop the parent involvement policy with administration.</li>
                <li>
                  We connect parents with information about their rights under
                  federal education law.
                </li>
              </ul>
            </div>

            <p className="lbl" style={{ marginTop: "1.5rem" }}>
              Current Officers
            </p>
            <div className="officers-grid">
              <div className="officer-card">
                <div className="officer-role">Chair</div>
                <div className="officer-name">Jason Menard</div>
              </div>
              <div className="officer-card">
                <div className="officer-role">Vice Chair</div>
                <div className="officer-name">Katie Denny</div>
              </div>
              <div className="officer-card">
                <div className="officer-role">Secretary</div>
                <div className="officer-name">Kathryn Clark</div>
              </div>
              <div className="officer-card">
                <div className="officer-role">Outreach Coordinator</div>
                <div className="officer-name">Steve Larosiliere</div>
              </div>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(3)}>
              Back
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(5)}>
              Next <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 5: Become a PAC Member */}
        <div className={currentScreen === 5 ? "screen active" : "screen"} data-screen="5">
          <div className="screen-content">
            {!submitted && (
              <div className="form-section" id="registration-form-section">
                <p className="eyebrow" style={{ textAlign: "center" }}>
                  Join Us
                </p>
                <h2>Now that you know the PAC, become a member.</h2>
                <p className="form-sub">
                  By registering, you&apos;re joining a group of Senn parents
                  working to make sure Title I funds serve our families.
                </p>

                <form id="playbook-form" onSubmit={submitPlaybookForm}>
                  <div className="f">
                    <label className="lbl">Full Name *</label>
                    <input type="text" name="name" required />
                  </div>
                  <div className="f">
                    <label className="lbl">Email *</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="f">
                    <label className="lbl">Student Name(s) *</label>
                    <input type="text" name="student" required />
                  </div>
                  <div className="f">
                    <label className="lbl">Student Grade(s) *</label>
                    <select name="grade" required defaultValue="">
                      <option value="">Select grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                      <option value="multiple">Multiple</option>
                    </select>
                  </div>
                  <div className="f">
                    <label className="lbl">
                      Phone{" "}
                      <span className="opt">
                        (optional, for text/WhatsApp updates)
                      </span>
                    </label>
                    <input type="tel" name="phone" />
                  </div>
                  <div className="f">
                    <label className="lbl">Preferred Language</label>
                    <select
                      name="language"
                      defaultValue="English"
                      onChange={(e) => setShowOtherLang(e.target.value === "Other")}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      id="other-lang"
                      name="language_other"
                      placeholder="Please specify your language"
                      style={{
                        display: showOtherLang ? "block" : "none",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                  <div className="f">
                    <span className="lbl">How do you want to hear from us?</span>
                    <div className="chips">
                      <label className="chip">
                        <input
                          type="checkbox"
                          name="contact_email"
                          value="Email"
                          defaultChecked
                        />{" "}
                        Email
                      </label>
                      <label className="chip">
                        <input type="checkbox" name="contact_text" value="Text" />{" "}
                        Text
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
                        I have reviewed the PAC Playbook and understand how
                        Title I parent engagement works at Senn.
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
                    {submitting ? "Submitting..." : "Register as a Member"}
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
              <h2>Welcome to the Senn PAC!</h2>
              <p>
                You&apos;re officially registered. Now see what families are
                saying and vote on our first workshop.
              </p>
              <button
                className="btn btn-green"
                style={{ marginTop: "1.5rem" }}
                onClick={() => goToScreen(6)}
              >
                See Survey Results <span className="arrow">&rarr;</span>
              </button>
            </div>
          </div>
          {!submitted && (
            <div className="screen-nav" id="screen-5-nav">
              <button className="btn btn-quiet" onClick={() => goToScreen(4)}>
                Back
              </button>
              <div></div>
            </div>
          )}
        </div>

        {/* Screen 6: What Did Senn Parents Tell Us? */}
        <div className={currentScreen === 6 ? "screen active" : "screen"} data-screen="6">
          <div className="screen-content">
            <p className="eyebrow">Survey Results</p>
            <h1>What Did Senn Parents Tell Us?</h1>
            <div className="content-block">
              <p>
                At Report Card Pick-Up on March 18, over 100 families responded
                to our survey.
              </p>
            </div>

            <p className="lbl">Top 3 Priorities</p>
            <div className="priority-cards">
              <div className="priority-card">
                <span className="priority-badge">#1</span>
                <div className="card-icon">&#127891;</div>
                <h4>College &amp; Career Planning</h4>
                <div className="pct">75%</div>
              </div>
              <div className="priority-card">
                <span className="priority-badge">#2</span>
                <div className="card-icon">&#128154;</div>
                <h4>Mental Health &amp; Well-Being</h4>
                <div className="pct">65%</div>
              </div>
              <div className="priority-card">
                <span className="priority-badge">#3</span>
                <div className="card-icon">&#9878;&#65039;</div>
                <h4>Know Your Rights</h4>
                <div className="pct">40%</div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-box">
                <div className="stat-number">85%</div>
                <div className="stat-label">Want to stay connected with the PAC</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">45%</div>
                <div className="stat-label">
                  Had never heard of the PAC before that day
                </div>
              </div>
            </div>

            <div className="highlight-box">
              Languages represented: English, Spanish, Kinyarwanda, Swahili, and
              more.
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(5)}>
              Back
            </button>
            <button className="btn btn-gold" onClick={() => goToScreen(7)}>
              Next <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Screen 7: What's Next? */}
        <div className={currentScreen === 7 ? "screen active" : "screen"} data-screen="7">
          <div className="screen-content">
            <p className="eyebrow">Take Action</p>
            <h1>What&apos;s Next?</h1>
            <div className="content-block">
              <div className="next-item">
                <div className="next-icon">&#128499;</div>
                <div>
                  <p>
                    <strong>Vote on the first workshop</strong> the PAC should
                    organize.
                    <br />
                    <Link href="/vote">Cast your vote here.</Link>
                  </p>
                </div>
              </div>
              <div className="next-item">
                <div className="next-icon">&#128197;</div>
                <div>
                  <p>
                    <strong>Next PAC meeting:</strong> Tuesday, April 21, 2026,
                    7:00&ndash;8:30 PM CT at Little Red Nest, 5456 N. Ashland
                    Ave, Chicago, IL 60640. Virtual option:{" "}
                    <a
                      href="https://us06web.zoom.us/j/8611443771"
                      target="_blank"
                      rel="noopener"
                    >
                      Join via Zoom
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="next-item">
                <div className="next-icon">&#128176;</div>
                <div>
                  <p>
                    Title I PAC funds (Grant #430329, Fund 332) are not subject
                    to the April 8 general spending deadline, but activities
                    should be scheduled in April and May before the last day of
                    school on June 4.
                  </p>
                </div>
              </div>
              <div className="next-item">
                <div className="next-icon">&#127919;</div>
                <div>
                  <p>
                    The PAC will select a CPS approved vendor and schedule the
                    winning workshop in May.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="screen-nav">
            <button className="btn btn-quiet" onClick={() => goToScreen(6)}>
              Back
            </button>
            <Link href="/vote" className="btn btn-gold">
              Vote Now <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* End playbook content wrapper */}
      </div>

      <Footer />
    </>
  );
}
