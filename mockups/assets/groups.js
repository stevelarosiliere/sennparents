/* Senn Parents — group config + seeded demo content.
   In production this comes from the shared Google Sheet via Apps Script.
   Here it is inline so the mockups run with no backend. */

const GROUPS = [
  {
    slug: 'pac',
    name: 'PAC',
    full: 'Parent Advisory Council',
    color: 'var(--pac)',
    blurb: 'The parent voice on how Senn spends its Title I family engagement budget.',
    who: 'Any Senn parent or guardian. No election required to attend.',
    sections: ['announcements', 'events', 'about', 'efforts', 'minutes', 'bylaws', 'grants', 'contact'],
    secretary: 'Kathryn Clark'
  },
  {
    slug: 'fos',
    name: 'FOS',
    full: 'Friends of Senn',
    color: 'var(--fos)',
    blurb: 'Fundraising and direct support for classrooms, teachers, and school programs.',
    who: 'Parents, alumni, neighbors, and local businesses.',
    sections: ['announcements', 'events', 'about', 'efforts', 'minutes', 'bylaws', 'grants', 'subcommittees', 'contact'],
    secretary: 'FOS Secretary'
  },
  {
    slug: 'bac',
    name: 'BAC',
    full: 'Bilingual Advisory Committee',
    color: 'var(--bac)',
    blurb: 'Families of multilingual learners shaping how Senn serves their students.',
    who: 'Parents of students in bilingual or EL programs. Interpretation provided.',
    sections: ['announcements', 'events', 'about', 'minutes', 'bylaws', 'grants', 'contact'],
    secretary: 'BAC Secretary'
  },
  {
    slug: 'arts',
    name: 'Arts Boosters',
    full: 'Senn Arts Boosters',
    color: 'var(--arts)',
    blurb: 'Backing theatre, music, dance, and visual arts at Senn.',
    who: 'Families of arts students and anyone who shows up for opening night.',
    sections: ['announcements', 'events', 'about', 'efforts', 'contact'],
    secretary: 'Arts Boosters Chair',
    parent: 'fos'
  },
  {
    slug: 'athletics',
    name: 'Athletic Boosters',
    full: 'Senn Athletic Boosters',
    color: 'var(--athletics)',
    blurb: 'Uniforms, equipment, concessions, and crowds for every Bulldogs team.',
    who: 'Families of athletes and anyone who fills the bleachers.',
    sections: ['announcements', 'events', 'about', 'efforts', 'contact'],
    secretary: 'Athletic Boosters Chair'
  },
  {
    slug: 'icewatch',
    name: 'Ice Watch',
    full: 'Senn Ice Watch',
    color: 'var(--icewatch)',
    blurb: 'Know Your Rights training and rapid response so every family stays safe.',
    who: 'Any family who wants to be trained or supported.',
    sections: ['announcements', 'events', 'about', 'kyr', 'resources', 'contact'],
    secretary: 'Ice Watch Coordinator'
  }
];

const GROUP_BY_SLUG = Object.fromEntries(GROUPS.map(g => [g.slug, g]));

/* --- Seeded content (stand-in for Sheet rows) --- */

const EVENTS = [
  { group: 'pac',        title: 'PAC Meeting: Back to School Kickoff', date: '2026-08-25', time: '7:00 PM',  where: 'Senn Library + Zoom', rsvp: true },
  { group: 'athletics',  title: 'Home Opener vs. Amundsen',            date: '2026-08-28', time: '6:30 PM',  where: 'Senn Field',          rsvp: false },
  { group: 'fos',        title: 'Fall Fundraiser Planning Session',    date: '2026-09-02', time: '6:00 PM',  where: 'Little Red Nest',     rsvp: true },
  { group: 'icewatch',   title: 'Know Your Rights Training (ES/EN)',   date: '2026-09-05', time: '10:00 AM', where: 'Senn Auditorium',     rsvp: true },
  { group: 'bac',        title: 'BAC Welcome Breakfast',               date: '2026-09-09', time: '8:15 AM',  where: 'Senn Cafeteria',      rsvp: true },
  { group: 'arts',       title: 'Fall Play Auditions Info Night',      date: '2026-09-11', time: '7:00 PM',  where: 'Senn Black Box',      rsvp: false },
  { group: 'fos',        title: 'Teacher Appreciation Breakfast',      date: '2026-09-18', time: '7:30 AM',  where: 'Senn Cafeteria',      rsvp: true },
  { group: 'athletics',  title: 'Booster Concessions Volunteer Night', date: '2026-09-24', time: '5:30 PM',  where: 'Senn Field House',    rsvp: true }
];

const ANNOUNCEMENTS = [
  { group: 'pac',       title: 'May minutes posted, laptop purchase approved', date: '2026-08-08', body: 'The cabinet and laptop quotes were approved 9 to 0. Full minutes are on the PAC page.' },
  { group: 'fos',       title: 'Classroom grant applications open August 20',  date: '2026-08-07', body: 'Teachers can request up to $500 per classroom. Two week window, decisions by mid September.' },
  { group: 'icewatch',  title: 'New Know Your Rights cards, English and Spanish', date: '2026-08-05', body: 'Printed cards are in the main office and at every Ice Watch table. Free, take as many as you need.' },
  { group: 'athletics', title: 'Fall sports physicals due August 22',          date: '2026-08-04', body: 'No physical on file means no practice. The nurse has walk in hours Thursday afternoons.' },
  { group: 'bac',       title: 'Interpretation now standing at every meeting', date: '2026-08-01', body: 'Spanish interpretation is confirmed for all BAC and PAC meetings this year. Other languages on request.' },
  { group: 'arts',      title: 'Season announced: fall play, winter concert, spring showcase', date: '2026-07-29', body: 'Three productions this year plus the spring art walk. Volunteer slots open in September.' }
];

const EFFORTS = [
  { group: 'fos',       title: 'Library volunteer day',        ask: 'We need 12 parents to sort and shelve the new collection.', deadline: 'Aug 23',  cta: 'Sign up' },
  { group: 'arts',      title: 'Fall play costume fund',       ask: 'Raising $2,400 for costumes and set materials.',            deadline: 'Sept 15', cta: 'Donate' },
  { group: 'athletics', title: 'Concession stand shifts',      ask: 'Two hour shifts at home games. Proceeds fund uniforms.',    deadline: 'Ongoing', cta: 'Take a shift' },
  { group: 'icewatch',  title: 'Rapid response phone tree',    ask: 'Volunteers to hold a slot on the response rotation.',       deadline: 'Ongoing', cta: 'Volunteer' }
];

/* --- Helpers --- */

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(y, m - 1, d).getDay()];
  return `${dow}, ${months[m - 1]} ${d}`;
}

function groupName(slug) { return GROUP_BY_SLUG[slug] ? GROUP_BY_SLUG[slug].name : slug; }
function groupColor(slug) { return GROUP_BY_SLUG[slug] ? GROUP_BY_SLUG[slug].color : 'var(--gray-500)'; }

function chipHTML(slug) {
  return `<span class="chip"><span class="dot" style="background:${groupColor(slug)}"></span>${groupName(slug)}</span>`;
}

/* Mixed feed: news and events on one timeline, ordered by nearness to today.
   Recent news and soon-to-happen events both float to the top, which is what
   a parent scanning the page actually wants. */
const TODAY = '2026-08-11';

function daysFrom(iso, ref) {
  const d = (s) => { const [y, m, dd] = s.split('-').map(Number); return Date.UTC(y, m - 1, dd); };
  return Math.abs(d(iso) - d(ref)) / 86400000;
}

function buildFeed() {
  const a = ANNOUNCEMENTS.map(x => ({ ...x, kind: 'news' }));
  const e = EVENTS.map(x => ({ ...x, kind: 'event', body: `${x.time} · ${x.where}` }));
  return [...e, ...a].sort((p, q) => daysFrom(p.date, TODAY) - daysFrom(q.date, TODAY));
}

/* Shared nav + footer injection, so there is one copy instead of fourteen */
function renderNav(active) {
  const dd = GROUPS.map(g =>
    `<a href="group.html?g=${g.slug}"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:${g.color};display:inline-block"></span>${g.full}</a>`
  ).join('');

  return `
<nav>
  <div class="nav-inner">
    <a href="${active === 'a' ? 'a.html' : 'b.html'}" class="nav-brand">
      <img src="assets/sp-shield.jpg" alt="Senn Parents">
      <span class="nav-brand-text">SENN <span>PARENTS</span></span>
    </a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"
            onclick="const l=document.querySelector('.nav-links');l.classList.toggle('open');this.setAttribute('aria-expanded',l.classList.contains('open'))">&#9776;</button>
    <ul class="nav-links">
      <li class="nav-dd">
        <a href="#" onclick="this.parentElement.classList.toggle('open');return false">Groups &#9662;</a>
        <div class="nav-dd-panel">${dd}</div>
      </li>
      <li><a href="#events">Events</a></li>
      <li><a href="#efforts">Volunteer</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#join" class="is-gold">Join</a></li>
      <li><a href="#" class="is-gold">Espa&ntilde;ol</a></li>
    </ul>
  </div>
</nav>`;
}

function renderFooter() {
  const links = GROUPS.map(g => `<a href="group.html?g=${g.slug}">${g.name}</a>`).join('');
  return `
<footer>
  <div class="footer-groups">${links}<a href="#join">Join</a><a href="#events">Events</a></div>
  <strong>Nicholas Senn High School</strong>
  5900 N. Glenwood Ave, Chicago IL 60660<br>
  <a href="mailto:sennparents@gmail.com">sennparents@gmail.com</a>
  <div style="margin-top:0.75rem;opacity:0.5">&copy; 2026 Senn Parents</div>
  <div style="margin-top:0.35rem;opacity:0.4;font-size:0.75rem">Powered by <a href="https://buildergrowth.io" target="_blank" rel="noopener">BuilderGrowth</a></div>
</footer>`;
}

function mountShell(active) {
  const navSlot = document.getElementById('nav-slot');
  const footSlot = document.getElementById('footer-slot');
  if (navSlot) navSlot.outerHTML = renderNav(active);
  if (footSlot) footSlot.outerHTML = renderFooter();
}
