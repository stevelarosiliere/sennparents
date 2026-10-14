import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Meeting Minutes | Senn Parent Advisory Council",
  description:
    "Past meeting minutes for the Nicholas Senn High School Parent Advisory Council.",
  openGraph: {
    title: "Senn PAC Meeting Minutes",
    description:
      "Past meeting minutes for the Nicholas Senn High School Parent Advisory Council.",
    type: "website",
    url: "https://sennparents.com/minutes",
    images: ["/Brand-Assets/Logo/senn-parents-final.jpg"],
  },
};

const navLinks = [
  { href: "/#meeting", label: "Next Meeting" },
  { href: "/minutes", label: "Minutes" },
  { href: "/vote", label: "Vote" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/es", label: "Español" },
  { href: "/join", label: "Join", pill: true },
];

export default function MinutesPage() {
  return (
    <>
      <style>{`
        /* Reading column: minutes are long-form, so the content sits in a
           narrower measure inside the wrap. */
        .minutes-col { max-width: 860px; margin: 0 auto; }
        .minutes-col .sec-head h1 { font-size: clamp(1.9rem, 4vw, 2.9rem); }

        /* Table of contents: dir-list rows in a white card */
        .toc {
            background: var(--white);
            border-radius: var(--r);
            padding: 1.1rem 1.5rem 1.25rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
        }
        .toc .eyebrow { color: var(--green-mid); margin-bottom: 0.15rem; }
        .toc .dir-list li:last-child { border-bottom: none; }
        .toc .dir-list a { padding: 0.7rem 0; }

        /* One meeting = one white card */
        .minutes-card {
            background: var(--white);
            border-radius: var(--r-lg);
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
            scroll-margin-top: 90px;
        }
        .minutes-head {
            display: grid;
            grid-template-columns: 86px 1fr;
            gap: 1.25rem;
            align-items: center;
            margin-bottom: 1.25rem;
        }
        .minutes-card h2 { font-size: 1.4rem; }

        .minutes-meta {
            color: var(--ink-60);
            font-size: 0.9rem;
            margin-top: 0.4rem;
        }
        .minutes-meta strong { color: var(--ink); font-weight: 700; }

        .minutes-section { margin-bottom: 1.5rem; }
        .minutes-section:last-child { margin-bottom: 0; }
        .minutes-section h3 {
            font-size: 1.05rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.55rem;
        }
        .minutes-section h3 .num {
            background: var(--green-soft);
            color: var(--green);
            width: 26px;
            height: 26px;
            border-radius: 9px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 800;
            flex-shrink: 0;
        }
        .minutes-section p {
            color: var(--ink-60);
            font-size: 0.95rem;
            margin-bottom: 0.6rem;
        }
        .minutes-section p strong { color: var(--ink); }
        .minutes-section ul {
            padding-left: 1.25rem;
            margin-bottom: 0.6rem;
        }
        .minutes-section ul li {
            color: var(--ink-60);
            font-size: 0.95rem;
            margin-bottom: 0.4rem;
        }
        .minutes-section ul li strong { color: var(--ink); }
        .minutes-section ul li::marker { color: var(--gold); }

        .motion {
            background: var(--green-soft);
            border-left: 3px solid var(--green-mid);
            border-radius: 12px;
            padding: 0.75rem 1rem;
            margin: 0.5rem 0 0.75rem;
            font-size: 0.93rem;
            color: var(--ink-60);
        }
        .motion strong { color: var(--green); }

        .attendees {
            background: var(--bone);
            border-radius: 14px;
            padding: 1rem 1.25rem;
            font-size: 0.92rem;
            color: var(--ink-60);
            margin-bottom: 1.5rem;
        }
        .attendees strong {
            color: var(--green);
            display: block;
            margin-bottom: 0.35rem;
            font-size: 0.78rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.09em;
        }

        .archive-note {
            text-align: center;
            color: var(--ink-60);
            font-size: 0.9rem;
            padding: 1rem 1.25rem;
            background: var(--gold-soft);
            border-radius: var(--r);
            margin-top: 1rem;
        }
        .archive-note a { color: var(--green); font-weight: 600; }

        @media (max-width: 620px) {
            .minutes-card { padding: 1.5rem 1.25rem; }
            .minutes-card h2 { font-size: 1.2rem; }
            .minutes-head { grid-template-columns: 72px 1fr; gap: 1rem; }
        }
      `}</style>

      <Nav links={navLinks} />

      <section id="minutes">
        <div className="wrap">
          <div className="minutes-col">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Records</p>
                <h1>PAC Meeting Minutes</h1>
                <p className="lede">
                  Public record of decisions, discussions, and action items from
                  past Parent Advisory Council meetings.
                </p>
              </div>
            </div>

            {/* TOC */}
            <div className="toc">
              <p className="eyebrow">On This Page</p>
              <ul className="dir-list">
                <li>
                  <a href="#april-2026">
                    <span className="dot"></span>April 21, 2026 &mdash; Regular
                    Meeting<span className="go">&rarr;</span>
                  </a>
                </li>
                <li>
                  <a href="#march-2026">
                    <span className="dot"></span>March 17, 2026 &mdash; Regular
                    Meeting<span className="go">&rarr;</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* APRIL 2026 */}
            <article id="april-2026" className="minutes-card">
              <div className="minutes-head">
                <div className="cal-when">
                  <b>21</b>
                  <span>Apr 2026</span>
                </div>
                <div>
                  <h2>Regular Meeting &mdash; April 21, 2026</h2>
                  <div className="minutes-meta">
                    <strong>Location:</strong> Little Red Nest, 5456 N. Ashland,
                    Chicago, IL 60640 (with video conference)
                    <br />
                    <strong>Called to Order:</strong> 7:00 p.m.{" "}
                    &nbsp;&middot;&nbsp; <strong>Adjourned:</strong> 8:00 p.m.
                  </div>
                </div>
              </div>

              <div className="attendees">
                <strong>Present</strong>
                Kathryn Clark (Senn parent), Katie Denny (Senn parent), Steve
                Larosiliere (Senn parent), Jason Menard (Senn parent), Suzy
                Connelly (Senn parent), Ariana Evans (Senn parent), Kim Curtis
                (Senn parent); additional attendees joined by video.
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">1</span> Call to Order
                </h3>
                <p>
                  Mr. Menard called the meeting of the Senn Parent Advisory
                  Council to order at 7:00 p.m.
                </p>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">2</span> Action Items
                </h3>
                <p>
                  <strong>Approval of March 2026 Meeting Minutes.</strong>
                </p>
                <div className="motion">
                  <strong>MOTION:</strong> Mr. Menard moved approval of the
                  meeting minutes of the March 17, 2026 meeting of the PAC,
                  attached as Exhibit A. <strong>CARRIED UNANIMOUSLY.</strong>
                </div>
                <p>
                  The PAC agreed that future minutes and agendas will also be
                  prepared in Spanish.
                </p>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">3</span> PAC Updates
                </h3>
                <ul>
                  <li>
                    <strong>Parent Survey results.</strong> Three key priorities
                    surfaced: college and career planning, mental health and
                    well-being, and &quot;Know Your Rights.&quot; The survey
                    collected over 85 email addresses and phone numbers; 85% of
                    respondents want to stay connected. 80% cited work schedules
                    as the main barrier to participation, with most preferring
                    later evening meetings. 45% had never heard of the PAC
                    before.
                  </li>
                  <li>
                    <strong>Laptop and storage update.</strong> The budget
                    transfer was confirmed for purchasing a laptop. Discussion
                    focused on laptop specifications and the need to access
                    school-licensed software. The library was identified as a
                    location for storing PAC materials in a secure cabinet,
                    following a tour by Friends of Senn (FOS) representatives.
                  </li>
                  <li>
                    <strong>Library update.</strong> Discussion regarding
                    transforming part of the library into a dedicated parent
                    resource area with furniture, multilingual informational
                    materials, and PAC storage. FOS has scheduled volunteer days
                    (tentatively May 30 and June 6) to organize books and set up
                    the space. The library also offers a sound booth that could
                    be used for multilingual communications.
                  </li>
                  <li>
                    <strong>Know Your Rights workshop update.</strong> Catherine
                    Vitron-Vera, who led last year&apos;s workshop, is available
                    to lead another free session. The group discussed timing
                    (after 4 p.m. on Tuesdays/Wednesdays, or possibly Saturdays)
                    and format. There was interest in adding immigration rights
                    information regarding the legal process.
                  </li>
                  <li>
                    <strong>End-of-year event planning.</strong> The group
                    proposed combining efforts to host an end-of-year parent
                    event featuring a workshop, potluck (cultural dishes), and
                    community celebration, coordinated with FOS and potentially
                    the library volunteer days.
                  </li>
                  <li>
                    <strong>College application workshop resources.</strong> Ms.
                    Denny reported challenges finding parent-focused college
                    application resources, as most are directed at students. She
                    submitted a request to the Illinois Student Assistance
                    Commission for a &quot;supporting your high school
                    student&quot; presentation. Ms. Curtis mentioned a CPS
                    strategic scholarship program workshop that may offer
                    additional resources.
                  </li>
                  <li>
                    <strong>Pierce Parent Night at Senn.</strong> Mr. Menard
                    discussed promoting the PAC on May 6, 2026, for Urinetown /
                    Peirce Parent Night. Ms. Clark will also attend.
                  </li>
                  <li>
                    <strong>Parent coordination and communication.</strong>{" "}
                    Discussion regarding the importance of coordination between
                    Senn parent groups and Senn/Peirce parents, and access to
                    information across multiple administrators. The group
                    discussed creating one website to simplify information
                    access, a uniform parent calendar, and other strategies for
                    improving communication.
                  </li>
                </ul>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">4</span> Adjournment
                </h3>
                <p>
                  Next meeting set for{" "}
                  <strong>May 19, 2026 at 7:00 p.m.</strong> (location to be
                  confirmed). Meeting adjourned at 8:00 p.m.
                </p>
              </div>
            </article>

            {/* MARCH 2026 */}
            <article id="march-2026" className="minutes-card">
              <div className="minutes-head">
                <div className="cal-when">
                  <b>17</b>
                  <span>Mar 2026</span>
                </div>
                <div>
                  <h2>Regular Meeting &mdash; March 17, 2026</h2>
                  <div className="minutes-meta">
                    <strong>Location:</strong> Nicholas Senn High School, Room
                    115 (with video conference)
                    <br />
                    <strong>Called to Order:</strong> 6:00 p.m.{" "}
                    &nbsp;&middot;&nbsp; <strong>Adjourned:</strong> 7:17 p.m.
                  </div>
                </div>
              </div>

              <div className="attendees">
                <strong>Present</strong>
                Michael Anglieri (community member, video); Kathryn Clark
                (parent, 10th grader); Chron Cross (Title I Coordinator, CPS
                Family and Community Engagement, video); Katie Denny (parent,
                9th grader); Steve Larosiliere (parent, 9th grader); Melody
                Littlefair (Senn Assistant Principal); Jason Menard (parent,
                11th grader); John Schietinger (parent, 10th grader, video);
                Valerie Schull (parent, 12th grader, video).
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">1</span> Call to Order
                </h3>
                <p>
                  Mr. Menard called the meeting of the Senn Parent Advisory
                  Council to order at 6:00 p.m.
                </p>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">2</span> Action Items
                </h3>

                <p>
                  <strong>
                    (a) Approval of the PAC Meeting Agenda for March 17, 2026.
                  </strong>
                </p>
                <div className="motion">
                  <strong>MOTION:</strong> Mr. Menard moved approval of the
                  agenda for the March 17, 2026 PAC meeting, attached as Exhibit
                  A. <strong>CARRIED UNANIMOUSLY.</strong>
                </div>

                <p>
                  <strong>(b) February 26, 2026 PAC Meeting Minutes.</strong>{" "}
                  Approval tabled until the April 21, 2026 meeting.
                </p>

                <p>
                  <strong>(c) Election of PAC Officers.</strong> The following
                  persons were nominated as officers:
                </p>
                <ul>
                  <li>Jason Menard &mdash; Chair</li>
                  <li>Katie Denny &mdash; Vice Chair</li>
                  <li>Steve Larosiliere &mdash; Community Outreach Officer</li>
                  <li>Kathryn Clark &mdash; Secretary</li>
                </ul>
                <div className="motion">
                  <strong>MOTION:</strong> Mr. Menard moved the election of each
                  of the foregoing persons. Each motion{" "}
                  <strong>CARRIED UNANIMOUSLY.</strong>
                </div>

                <p>
                  <strong>(d) Budget Approvals.</strong>
                </p>
                <div className="motion">
                  <strong>MOTION:</strong> Mr. Menard moved to open a new budget
                  line from 47061.332.53405.390030.430329.2026 to
                  47061.332.55005.390030.430329.2026 for the PAC to purchase
                  furniture and equipment. <strong>CARRIED UNANIMOUSLY.</strong>
                </div>
                <div className="motion">
                  <strong>MOTION:</strong> Mr. Menard moved to transfer $2,000
                  from PAC account #53405 (commodities) to new account #55005
                  for spending on furniture and equipment, including a laptop.{" "}
                  <strong>CARRIED UNANIMOUSLY.</strong>
                </div>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">3</span> PAC Updates
                </h3>
                <ul>
                  <li>
                    <strong>$6,000 PAC budget.</strong> Discussion of allowable
                    uses (roughly half for furniture, supplies, and equipment;
                    half for services such as seminars and training), budget
                    lines (including requesting and creating new ones for food
                    and drinks), and the spending process: the PAC votes on
                    spending, the Principal must approve, and the Principal
                    submits it to the CPS Budget Department for approval. The
                    group reviewed timing for these processes.
                  </li>
                  <li>
                    <strong>PAC records storage.</strong> Storing PAC records,
                    binders, and other materials at Senn, including a dedicated
                    cabinet and space for agendas, minutes, budget summaries,
                    and inventories.
                  </li>
                  <li>
                    <strong>Outreach channels.</strong> Senn parent website
                    (sennparents.com), the Senn parent Facebook group, and the
                    Senn parent survey (29 responses to date, aiming for over
                    50).
                  </li>
                  <li>
                    <strong>Report card pickup.</strong> PAC representation at
                    report card pickup on March 18 at Senn, including collecting
                    survey responses via a laptop.
                  </li>
                </ul>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">4</span> New PAC Business
                </h3>
                <ul>
                  <li>Obtaining a laptop for the PAC.</li>
                  <li>
                    <strong>Parent survey takeaways so far:</strong> supporting
                    student mental health, event communication, workshops on
                    college applications, financial aid and career planning,
                    technology help, and Know Your Rights workshops are
                    important to parents.
                  </li>
                  <li>
                    <strong>Future PAC meetings.</strong> Targeting 7:00 p.m.
                    start time and potentially a meeting place outside Senn.
                    Notice and other requirements were reviewed: posting the
                    agenda with the meeting location, a quorum of at least five
                    Senn parents, and approval by a majority of Senn parents at
                    the meeting.
                  </li>
                  <li>
                    Coordinating and funding parent training and informational
                    sessions on Know Your Rights, student mental health, college
                    readiness, and potential free resources.
                  </li>
                  <li>
                    Continuous Improvement Work Plan, the Senn strategic plan,
                    and parent engagement.
                  </li>
                  <li>
                    More consideration, discussion, and approval of PAC fund use
                    to be addressed at the April 21, 2026 meeting.
                  </li>
                </ul>
              </div>

              <div className="minutes-section">
                <h3>
                  <span className="num">5</span> Adjournment
                </h3>
                <p>The meeting was adjourned at 7:17 p.m.</p>
              </div>
            </article>

            <p className="archive-note">
              Questions about a specific decision or motion? Email{" "}
              <a href="mailto:sennparents@gmail.com">sennparents@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
