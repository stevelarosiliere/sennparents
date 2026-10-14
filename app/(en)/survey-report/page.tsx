import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senn PAC Family Interest Survey Report 2025-2026",
};

export default function SurveyReportPage() {
  return (
    <>
      <style>{`
        /* ============================================================
           Family Interest Survey Report — Direction D reskin.
           Standalone page: keeps its own header/footer, no shared
           Nav/Footer. Bone page background comes from globals' body.
           ============================================================ */

        .page {
            max-width: 1020px;
            margin: 0 auto;
            padding: 0 1.75rem 3rem;
        }
        .page--last { padding-bottom: 0; }

        /* Header: green panel per page; the first one takes the hero
           idiom, rounded-bottom corners flush with the top of the page. */
        .report-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
            flex-wrap: wrap;
            background: var(--green);
            color: var(--white);
            border-radius: var(--r-lg);
            padding: 1.6rem 2rem;
            margin-bottom: 2rem;
        }
        .page--1 .report-header {
            border-radius: 0 0 var(--r-lg) var(--r-lg);
            padding: 2.2rem 2rem 2rem;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 0.9rem;
        }
        .header-logo {
            width: 56px;
            height: 56px;
            border-radius: 14px;
        }
        .header-text h1 {
            font-size: 1.15rem;
            font-weight: 900;
            color: var(--white);
            line-height: 1.15;
        }
        .header-text h1 span { color: var(--gold); }
        .header-text p {
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.72);
            margin-top: 0.15rem;
        }
        .header-right { text-align: right; }
        .header-right h2 {
            font-size: 1.05rem;
            color: var(--white);
        }
        .header-right p {
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--gold);
            margin-top: 0.2rem;
        }

        /* Title block: deep-green arch-panel idiom with the gold inset ring */
        .title-block {
            background: var(--green-deep);
            color: var(--white);
            padding: 2.25rem 2rem;
            border-radius: var(--r-lg);
            box-shadow: inset 0 0 0 1.5px rgba(212,160,23,0.35);
            text-align: center;
            margin-bottom: 1.75rem;
        }
        .title-block h2 {
            font-size: clamp(1.5rem, 3.2vw, 2.1rem);
            color: var(--white);
            margin-bottom: 0.5rem;
        }
        .title-block h2 span { color: var(--gold); }
        .title-block p {
            font-size: 0.98rem;
            color: rgba(255,255,255,0.85);
            max-width: 54ch;
            margin: 0 auto;
        }
        .title-block .date {
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--gold);
            margin-top: 0.9rem;
        }

        /* Stat callouts: the donor-card idiom, gold-topped; the second
           row of secondary counts takes a green-mid top instead. */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .stat-card {
            background: var(--white);
            border: 1px solid var(--line);
            border-top: 4px solid var(--gold);
            border-radius: var(--r);
            padding: 1.1rem 0.9rem 1rem;
            text-align: center;
        }
        .stat-card .number {
            font-size: 1.9rem;
            font-weight: 900;
            color: var(--green);
            line-height: 1.1;
            letter-spacing: -0.02em;
        }
        .stat-card .label {
            font-size: 0.66rem;
            font-weight: 800;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            color: var(--ink-60);
            margin-top: 0.4rem;
        }
        .stat-card--mid { border-top-color: var(--green-mid); }
        .stat-card--mid .number { font-size: 1.35rem; color: var(--green-mid); }

        /* Section headers: gold micro-tag plus tight-tracked heading */
        .section-header {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            flex-wrap: wrap;
            margin: 2rem 0 0.75rem;
        }
        .section-header .tag {
            background: var(--gold);
            color: var(--ink);
            font-size: 0.68rem;
            font-weight: 800;
            padding: 0.24rem 0.6rem;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        .section-header h3 { font-size: 1.15rem; color: var(--ink); }
        .two-col .section-header { margin-top: 0.5rem; }

        .sec-note {
            font-size: 0.9rem;
            color: var(--ink-60);
            max-width: 66ch;
            margin-bottom: 1rem;
        }

        /* Bar charts: white cards; bone pill tracks, green/gold pill fills */
        .bar-chart {
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: var(--r);
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
            padding: 1.4rem 1.5rem;
            margin-bottom: 1.5rem;
        }
        .bar-row {
            display: flex;
            align-items: center;
            gap: 0.9rem;
            margin-bottom: 0.65rem;
        }
        .bar-row:last-child { margin-bottom: 0; }
        .bar-label {
            width: 260px;
            flex-shrink: 0;
            font-size: 0.88rem;
            font-weight: 600;
            color: var(--ink);
            line-height: 1.3;
        }
        .two-col .bar-label { width: 148px; font-size: 0.82rem; }
        .bar-track {
            flex: 1;
            height: 26px;
            background: var(--bone);
            border-radius: 999px;
            box-shadow: inset 0 0 0 1.5px var(--line);
            overflow: hidden;
            position: relative;
        }
        .bar-fill {
            height: 100%;
            background: var(--green);
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            position: relative;
        }
        .bar-fill.gold { background: var(--gold); }
        .bar-pct {
            font-size: 0.72rem;
            font-weight: 800;
            color: var(--white);
        }
        .bar-fill.gold .bar-pct { color: var(--ink); }
        .bar-pct-outside {
            position: absolute;
            left: 100%;
            margin-left: 8px;
            font-size: 0.72rem;
            font-weight: 800;
            color: var(--green);
        }

        /* Two column */
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        /* Callouts: the need/notice idiom — white card, colored spine.
           Gold variant sits on the gold-soft band color. */
        .callout {
            background: var(--white);
            border: 1px solid var(--line);
            border-left: 6px solid var(--green);
            border-radius: var(--r);
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
            padding: 1.25rem 1.4rem;
            margin: 1.25rem 0;
        }
        .callout h4 {
            font-size: 0.76rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--green);
            margin-bottom: 0.35rem;
        }
        .callout p { font-size: 0.92rem; color: var(--ink-60); }
        .callout h4 + p + h4 { margin-top: 0.75rem; }
        .callout-gold {
            background: var(--gold-soft);
            border-left-color: var(--gold);
            box-shadow: none;
        }
        .callout-gold h4 { color: var(--ink); }
        .callout-gold p { color: var(--ink-60); }
        .vote-link {
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--green);
            margin-top: 0.35rem;
        }
        .vote-alt { font-size: 0.8rem; color: var(--ink-40); margin-top: 0.2rem; }

        /* Tables: white rounded cards, green header band, bone zebra */
        .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.92rem;
            margin: 0.75rem 0 1rem;
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: var(--r);
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
            overflow: hidden;
        }
        .data-table th {
            background: var(--green);
            color: var(--white);
            padding: 0.65rem 1rem;
            text-align: left;
            font-weight: 700;
            font-size: 0.72rem;
            letter-spacing: 0.07em;
            text-transform: uppercase;
        }
        .data-table td {
            padding: 0.65rem 1rem;
            border-bottom: 1px solid var(--line);
            color: var(--ink-60);
        }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:nth-child(even) { background: var(--bone); }

        /* Ranking cards: white cards, gold-soft winner with pill badge */
        .ranking {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin: 1.5rem 0;
        }
        .rank-card {
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: var(--r);
            padding: 1.5rem 1.1rem 1.2rem;
            text-align: center;
            position: relative;
        }
        .rank-card.top {
            background: var(--gold-soft);
            border: 2px solid var(--gold);
        }
        .rank-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gold);
            color: var(--ink);
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            padding: 0.2rem 0.7rem;
            border-radius: 999px;
        }
        .rank-card .icon { font-size: 1.7rem; margin-bottom: 0.4rem; }
        .rank-card h4 {
            font-size: 0.98rem;
            font-weight: 800;
            letter-spacing: -0.015em;
            color: var(--ink);
            margin-bottom: 0.25rem;
        }
        .rank-card p { font-size: 0.82rem; color: var(--ink-60); }

        /* Recommendations: white card list, gold dots, green leads */
        .rec-list {
            list-style: none;
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: var(--r);
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
            padding: 0.75rem 1.5rem;
        }
        .rec-list li {
            padding: 0.75rem 0 0.75rem 1.35rem;
            position: relative;
            font-size: 0.92rem;
            color: var(--ink-60);
            border-bottom: 1px solid var(--line);
        }
        .rec-list li:last-child { border-bottom: none; }
        .rec-list li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 1.35rem;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--gold);
        }
        .rec-list li strong { color: var(--green); }

        .note {
            font-size: 0.82rem;
            color: var(--ink-40);
            font-style: italic;
            margin-top: 0.5rem;
        }

        /* Page footers: quiet rules between pages; the last one takes
           the dark-ink footer idiom. */
        .page-footer {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
            font-size: 0.8rem;
            color: var(--ink-40);
            border-top: 1px solid var(--line);
            padding-top: 1.1rem;
            margin-top: 2.5rem;
        }
        .page--last .page-footer {
            background: var(--ink);
            color: rgba(255,255,255,0.6);
            border-top: none;
            border-radius: var(--r-lg) var(--r-lg) 0 0;
            padding: 2rem;
            margin-top: 3rem;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 900px) {
            .stats-row { grid-template-columns: repeat(2, 1fr); }
            .two-col { grid-template-columns: 1fr; }
            .ranking { grid-template-columns: 1fr; }
            .rank-card { padding-top: 1.6rem; }
        }
        @media (max-width: 620px) {
            .page { padding: 0 1.15rem 2.5rem; }
            .page--last { padding-bottom: 0; }
            .report-header, .page--1 .report-header { padding: 1.5rem 1.25rem; }
            .header-right { text-align: left; }
            .stats-row { gap: 0.6rem; }
            .bar-row { flex-direction: column; align-items: stretch; gap: 0.3rem; }
            .bar-label, .two-col .bar-label { width: auto; }
        }

        /* ---------- Print ---------- */
        @media print {
            .page { max-width: none; page-break-after: always; }
            .page--last { page-break-after: auto; }
            .bar-chart, .callout, .data-table, .rec-list {
                box-shadow: none;
            }
        }
      `}</style>

      {/* PAGE 1 */}
      <div className="page page--1">
        {/* Header */}
        <div className="report-header">
          <div className="header-left">
            <img
              src="/Brand-Assets/Logo/senn-parents-final.jpg"
              className="header-logo"
              alt="Senn Parents PAC"
            />
            <div className="header-text">
              <h1>
                SENN <span>PARENTS</span>
              </h1>
              <p>Parent Advisory Council</p>
            </div>
          </div>
          <div className="header-right">
            <h2>Family Interest Survey Report</h2>
            <p>2025-2026 School Year</p>
          </div>
        </div>

        {/* Title */}
        <div className="title-block">
          <h2>
            Family Interest <span>Survey Results</span>
          </h2>
          <p>
            What Senn families told us matters most for parent engagement
            programming
          </p>
          <div className="date">
            Collected March 12-19, 2026 | Report Card Pick-Up Activation
          </div>
        </div>

        {/* At a Glance */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="number">100+</div>
            <div className="label">Total Responses</div>
          </div>
          <div className="stat-card">
            <div className="number">7x</div>
            <div className="label">vs Last Year</div>
          </div>
          <div className="stat-card">
            <div className="number">5+</div>
            <div className="label">Languages</div>
          </div>
          <div className="stat-card">
            <div className="number">85%</div>
            <div className="label">Want to Stay Connected</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card stat-card--mid">
            <div className="number">85+</div>
            <div className="label">Emails Collected</div>
          </div>
          <div className="stat-card stat-card--mid">
            <div className="number">85+</div>
            <div className="label">Phone #s Collected</div>
          </div>
          <div className="stat-card stat-card--mid">
            <div className="number">~45</div>
            <div className="label">Want to Get Involved</div>
          </div>
          <div className="stat-card stat-card--mid">
            <div className="number">~40</div>
            <div className="label">Want to Be Informed</div>
          </div>
        </div>

        <div className="callout">
          <h4>Context</h4>
          <p>
            Last year: 14 responses. This year: 100+ in a single afternoon at
            Report Card Pick-Up (March 18). Languages: English, Spanish,
            Kinyarwanda, Swahili. Nearly every respondent provided email and
            phone, giving the PAC a real contact list.
          </p>
          <h4 style={{ marginTop: "0.75rem" }}>What Drove the Results</h4>
          <p>
            The biggest driver was coordinating with teachers and admins behind
            the report card tables, briefing them to direct parents to the PAC
            table. Having the survey on sennparents.com so parents could scan
            and complete on their phones also made a significant impact. A
            laptop was available as backup, but most parents preferred their
            own devices. The lesson: staff coordination beats any single
            tactic.
          </p>
        </div>

        {/* Top 3 Priorities */}
        <div className="section-header">
          <span className="tag">Key Finding</span>
          <h3>Top 3 Parent Priorities</h3>
        </div>
        <p className="sec-note">
          Parents picked their top 3 topics. These results directly inform how
          Title I parent engagement funds should be allocated.
        </p>

        <div className="ranking">
          <div className="rank-card top">
            <span className="rank-badge">#1</span>
            <div className="icon">&#127891;</div>
            <h4>College &amp; Career Planning</h4>
            <p>College apps, FAFSA, financial aid, career pathways</p>
          </div>
          <div className="rank-card">
            <span className="rank-badge">#2</span>
            <div className="icon">&#128154;</div>
            <h4>Mental Health &amp; Well-Being</h4>
            <p>Student emotional health, warning signs, resources</p>
          </div>
          <div className="rank-card">
            <span className="rank-badge">#3</span>
            <div className="icon">&#9878;&#65039;</div>
            <h4>Know Your Rights</h4>
            <p>Immigration, housing, special education rights</p>
          </div>
        </div>

        <div className="page-footer">
          <span>Senn Parent Advisory Council | sennparents.com</span>
          <span>Page 1 of 3</span>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="page">
        <div className="report-header">
          <div className="header-left">
            <img
              src="/Brand-Assets/Logo/senn-parents-final.jpg"
              className="header-logo"
              alt="Senn Parents PAC"
            />
            <div className="header-text">
              <h1>
                SENN <span>PARENTS</span>
              </h1>
              <p>Parent Advisory Council</p>
            </div>
          </div>
          <div className="header-right">
            <h2>Detailed Results</h2>
            <p>Page 2 of 3</p>
          </div>
        </div>

        {/* Full Topic Breakdown */}
        <div className="section-header" style={{ marginTop: 0 }}>
          <span className="tag">Topics</span>
          <h3>What Should the PAC Focus On? (Full Breakdown)</h3>
        </div>
        <p className="sec-note">
          Based on 20-response sample. Percentages reflect how often each topic
          appeared in parent selections (each parent chose up to 3).
        </p>

        <div className="bar-chart">
          <div className="bar-row">
            <div className="bar-label">College apps &amp; career planning</div>
            <div className="bar-track">
              <div className="bar-fill gold" style={{ width: "75%" }}>
                <span className="bar-pct">75%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">Mental health &amp; well-being</div>
            <div className="bar-track">
              <div className="bar-fill gold" style={{ width: "65%" }}>
                <span className="bar-pct">65%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">
              Family arts, culture, community events
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "45%" }}>
                <span className="bar-pct">45%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">
              Know Your Rights (immigration, housing, SpEd)
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "40%" }}>
                <span className="bar-pct">40%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">FAFSA &amp; financial aid</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "40%" }}>
                <span className="bar-pct">40%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">
              Technology help (school apps, internet safety)
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "30%" }}>
                <span className="bar-pct">30%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">
              English/literacy classes for parents
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "20%" }}>
                <span className="bar-pct">20%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">
              Report cards &amp; academic progress tracking
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "15%" }}>
                <span className="bar-pct">15%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="two-col">
          <div>
            <div className="section-header">
              <span className="tag">Barriers</span>
              <h3 style={{ fontSize: "1rem" }}>
                What Makes It Hard to Participate?
              </h3>
            </div>
            <div className="bar-chart">
              <div className="bar-row">
                <div className="bar-label">Work schedule</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "80%" }}>
                    <span className="bar-pct">80%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Unaware of events</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "30%" }}>
                    <span className="bar-pct">30%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Childcare</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "25%" }}>
                    <span className="bar-pct">25%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Transportation</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "10%" }}>
                    <span className="bar-pct-outside">10%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Language barrier</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "10%" }}>
                    <span className="bar-pct-outside">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-header">
              <span className="tag">Scheduling</span>
              <h3 style={{ fontSize: "1rem" }}>When Can Parents Attend?</h3>
            </div>
            <div className="bar-chart">
              <div className="bar-row">
                <div className="bar-label">Weekday evenings</div>
                <div className="bar-track">
                  <div className="bar-fill gold" style={{ width: "50%" }}>
                    <span className="bar-pct">50%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Weekday mornings</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "40%" }}>
                    <span className="bar-pct">40%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Saturday mornings</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "35%" }}>
                    <span className="bar-pct">35%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Virtual options</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "30%" }}>
                    <span className="bar-pct">30%</span>
                  </div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Saturday afternoons</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "20%" }}>
                    <span className="bar-pct">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="two-col">
          <div>
            <div className="section-header">
              <span className="tag">Awareness</span>
              <h3 style={{ fontSize: "1rem" }}>Had You Heard of the PAC?</h3>
            </div>
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Response</th>
                  <th>%</th>
                </tr>
                <tr>
                  <td>Yes</td>
                  <td>55%</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>45%</td>
                </tr>
              </tbody>
            </table>
            <p className="note">
              Nearly half learned about the PAC for the first time at Report
              Card Pick-Up.
            </p>
          </div>
          <div>
            <div className="section-header">
              <span className="tag">Engagement</span>
              <h3 style={{ fontSize: "1rem" }}>Want to Stay Connected?</h3>
            </div>
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Response</th>
                  <th>%</th>
                </tr>
                <tr>
                  <td>Yes, get involved!</td>
                  <td>45%</td>
                </tr>
                <tr>
                  <td>Keep me informed</td>
                  <td>40%</td>
                </tr>
                <tr>
                  <td>Not at this time</td>
                  <td>15%</td>
                </tr>
              </tbody>
            </table>
            <p className="note">
              85% of respondents want ongoing connection with the PAC.
            </p>
          </div>
        </div>

        <div className="page-footer">
          <span>Senn Parent Advisory Council | sennparents.com</span>
          <span>Page 2 of 3</span>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className="page page--last">
        <div className="report-header">
          <div className="header-left">
            <img
              src="/Brand-Assets/Logo/senn-parents-final.jpg"
              className="header-logo"
              alt="Senn Parents PAC"
            />
            <div className="header-text">
              <h1>
                SENN <span>PARENTS</span>
              </h1>
              <p>Parent Advisory Council</p>
            </div>
          </div>
          <div className="header-right">
            <h2>Recommendations &amp; Next Steps</h2>
            <p>Page 3 of 3</p>
          </div>
        </div>

        <div className="section-header" style={{ marginTop: 0 }}>
          <span className="tag">Communication</span>
          <h3>How Parents Want to Hear From Us</h3>
        </div>
        <div className="bar-chart">
          <div className="bar-row">
            <div className="bar-label">Email</div>
            <div className="bar-track">
              <div className="bar-fill gold" style={{ width: "85%" }}>
                <span className="bar-pct">85%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">Text message</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "35%" }}>
                <span className="bar-pct">35%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">WhatsApp</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "20%" }}>
                <span className="bar-pct">20%</span>
              </div>
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-label">Social media</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "10%" }}>
                <span className="bar-pct-outside">10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="callout-gold callout">
          <h4>Title I Funding Context</h4>
          <p>
            Grant #430329 (Fund 332) Title I PAC funds are NOT subject to the
            April 8 general spending deadline. However, with the last day of
            school being June 4, 2026, all parent activities and training
            sessions should be scheduled throughout April and May.
          </p>
        </div>

        <div className="section-header">
          <span className="tag">Recommendations</span>
          <h3>What the Data Tells Us to Do</h3>
        </div>

        <ul className="rec-list">
          <li>
            <strong>Schedule workshops in the evening.</strong> Work schedule
            is the #1 barrier (80%). Weekday evenings (4-8 PM) are the most
            accessible time for the majority of parents.
          </li>
          <li>
            <strong>Always offer a virtual option.</strong> 30% of parents said
            virtual works best for their schedule. Use Zoom for hybrid access
            to every event.
          </li>
          <li>
            <strong>Prioritize college and career planning.</strong> This was
            the #1 topic chosen by 75% of respondents. FAFSA and financial aid
            was also ranked highly (40%), especially among 11th and 12th grade
            parents.
          </li>
          <li>
            <strong>Address mental health.</strong> The #2 priority at 65%.
            Partner with a CPS-approved wellness vendor like SEL Chicago,
            Wellness For Everyone, or Youth Guidance.
          </li>
          <li>
            <strong>Run a Know Your Rights session.</strong> 40% selected this,
            particularly families who speak languages other than English.
            Bilingual facilitation is essential.
          </li>
          <li>
            <strong>Invest in outreach and awareness.</strong> 45% had never
            heard of the PAC before this survey. 30% said &quot;unaware of
            events&quot; is a barrier. Email is the dominant channel (85%),
            but text and WhatsApp are important for multilingual families.
          </li>
          <li>
            <strong>Build a community event.</strong> 45% want family arts,
            culture, and community events. This builds trust and brings in
            families who might not attend a formal workshop.
          </li>
          <li>
            <strong>Plan for multilingual programming.</strong> Survey
            respondents speak English, Spanish, Kinyarwanda, Swahili, and other
            languages. Translation and culturally responsive facilitation are
            not optional.
          </li>
        </ul>

        <div className="section-header">
          <span className="tag">Next Steps</span>
          <h3>Action Plan: April - June 2026</h3>
        </div>

        <table className="data-table">
          <tbody>
            <tr>
              <th>Action</th>
              <th>Timeline</th>
              <th>Owner</th>
            </tr>
            <tr>
              <td>Workshop vote open on sennparents.com/vote</td>
              <td>Now - April 20</td>
              <td>Steve (Outreach)</td>
            </tr>
            <tr>
              <td>Share vote results at PAC meeting</td>
              <td>April 21</td>
              <td>Jason (Chair)</td>
            </tr>
            <tr>
              <td>Select and book vendor for winning workshop</td>
              <td>Week of April 21</td>
              <td>PAC Officers + Principal</td>
            </tr>
            <tr>
              <td>Host first parent workshop</td>
              <td>May (target: week of May 5)</td>
              <td>PAC + Vendor</td>
            </tr>
            <tr>
              <td>Plan second workshop or community event</td>
              <td>May</td>
              <td>PAC Officers</td>
            </tr>
            <tr>
              <td>End-of-year PAC report and reflection</td>
              <td>June 4 (last day)</td>
              <td>All Officers</td>
            </tr>
          </tbody>
        </table>

        <div className="callout-gold callout" style={{ textAlign: "center" }}>
          <h4>Vote on Our First Workshop</h4>
          <p>
            Share this link with families. Voting closes before the April 21
            meeting.
          </p>
          <p className="vote-link">sennparents.com/vote</p>
          <p className="vote-alt">Spanish: sennparents.com/vota</p>
        </div>

        <div className="callout">
          <h4>Prepared By</h4>
          <p>
            Steve Larosiliere, Outreach Coordinator | Senn Parent Advisory
            Council | sennparents@gmail.com | March 23, 2026
          </p>
        </div>

        <div className="page-footer">
          <span>Senn Parent Advisory Council | sennparents.com</span>
          <span>March 23, 2026</span>
        </div>
      </div>
    </>
  );
}
