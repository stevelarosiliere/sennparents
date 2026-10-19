/* Senn Parents — data layer v2 (the merged direction).
   In production every array below is a tab in the shared Google Sheet, read
   through Apps Script. Nothing here is hardcoded into the layout: add a row,
   the page grows. Add group #7, the page grows. That was Ariana's note and it
   drives the whole file.

   Changes from v1, all traceable to the Aug 17 / Sep 9 feedback:
   - TIERS: groups sort into Governance / Support / Safety (Diana)
   - LSC added as an info-only group pending the participation vote (Diana)
   - FOS recolored off the mustard (Sz)
   - EVENTS carry tags, real locations, virtual links, multiple groups,
     and open signup slots (consensus ask 1, 2, 3)
   - DONORS is new (Sz)
*/

/* --- Tiers. Order here is the order on the page. --- */
const TIERS = [
  {
    slug: 'governance',
    name: 'Governance',
    blurb: 'Elected and advisory bodies. These groups have a formal say in how the school is run and how money gets spent.'
  },
  {
    slug: 'support',
    name: 'Support',
    blurb: 'Fundraising and volunteer groups. These groups raise money, staff events, and back students directly.'
  },
  {
    slug: 'safety',
    name: 'Safety',
    blurb: 'Training and rapid response so every family at Senn knows their rights and knows who to call.'
  }
];

const GROUPS = [
  {
    slug: 'pac',
    name: 'PAC',
    full: 'Parent Advisory Council',
    tier: 'governance',
    color: 'var(--pac)',
    blurb: 'The parent voice on how Senn spends its Title I family engagement budget.',
    who: 'Any Senn parent or guardian. No election required to attend.',
    sections: ['announcements', 'events', 'about', 'efforts', 'minutes', 'bylaws', 'grants', 'contact'],
    secretary: 'Kathryn Clark',
    joinable: true
  },
  {
    slug: 'lsc',
    name: 'LSC',
    full: 'Local School Council',
    tier: 'governance',
    color: 'var(--lsc)',
    blurb: 'The elected council that approves the school budget, the improvement plan, and the principal contract.',
    who: 'Elected seats for parents, community members, teachers, and students.',
    sections: ['about', 'contact'],
    /* Info only until the group votes on whether Senn Parents carries LSC.
       Diana flagged this; Mr. Forgue and Mathieu are interested. Until that
       vote, the arch opens an explainer and there is no mailing list. */
    infoOnly: true,
    infoNote: 'Information only, pending a vote by the parent group.',
    joinable: false
  },
  {
    slug: 'bac',
    name: 'BAC',
    full: 'Bilingual Advisory Committee',
    tier: 'governance',
    color: 'var(--bac)',
    blurb: 'Families of multilingual learners shaping how Senn serves their students.',
    who: 'Parents of students in bilingual or EL programs. Interpretation provided.',
    sections: ['announcements', 'events', 'about', 'minutes', 'bylaws', 'grants', 'contact'],
    secretary: 'BAC Secretary',
    joinable: true
  },
  {
    slug: 'fos',
    name: 'Friends of Senn',
    full: 'Friends of Senn',
    tier: 'support',
    color: 'var(--fos)',
    blurb: 'Fundraising and direct support for classrooms, teachers, and school programs.',
    who: 'Parents, alumni, neighbors, and local businesses.',
    sections: ['announcements', 'events', 'about', 'efforts', 'minutes', 'bylaws', 'grants', 'subcommittees', 'contact'],
    secretary: 'FOS Secretary',
    joinable: true
  },
  {
    slug: 'arts',
    name: 'Arts Boosters',
    full: 'Senn Arts Boosters',
    tier: 'support',
    color: 'var(--arts)',
    blurb: 'Backing theatre, music, dance, and visual arts at Senn.',
    who: 'Families of arts students and anyone who shows up for opening night.',
    sections: ['announcements', 'events', 'about', 'efforts', 'contact'],
    secretary: 'Arts Boosters Chair',
    parent: 'fos',
    joinable: true
  },
  {
    slug: 'athletics',
    name: 'Athletic Boosters',
    full: 'Senn Athletic Boosters',
    tier: 'support',
    color: 'var(--athletics)',
    blurb: 'Uniforms, equipment, concessions, and crowds for every Bulldogs team.',
    who: 'Families of athletes and anyone who fills the bleachers.',
    sections: ['announcements', 'events', 'about', 'efforts', 'contact'],
    secretary: 'Athletic Boosters Chair',
    joinable: true
  },
  {
    slug: 'icewatch',
    name: 'Ice Watch',
    full: 'Senn Ice Watch',
    tier: 'safety',
    color: 'var(--icewatch)',
    blurb: 'Know Your Rights training and rapid response so every family stays safe.',
    who: 'Any family who wants to be trained or supported.',
    sections: ['announcements', 'events', 'about', 'kyr', 'resources', 'contact'],
    secretary: 'Ice Watch Coordinator',
    joinable: true
  }
];

const GROUP_BY_SLUG = Object.fromEntries(GROUPS.map(g => [g.slug, g]));

/* --- Event tags. Sz and Diana both asked for these. --- */
const TAGS = {
  meeting:    { label: 'Meeting',    color: 'var(--pac)' },
  volunteer:  { label: 'Volunteer',  color: 'var(--athletics)' },
  fundraiser: { label: 'Fundraiser', color: 'var(--fos)' },
  social:     { label: 'Social',     color: 'var(--arts)' },
  training:   { label: 'Training',   color: 'var(--icewatch)' }
};

/* --- Events.
   groups[] not group: one event can belong to several (consensus ask 2).
   place.kind: 'senn' | 'offsite' | 'virtual'
   slots[]:    open signup slots, e.g. concession shifts (Sz)
*/
const EVENTS = [
  {
    id: 'pac-kickoff',
    groups: ['pac'],
    title: 'PAC Meeting: Back to School Kickoff',
    date: '2026-08-25', time: '7:00 PM', ends: '8:30 PM',
    tags: ['meeting'],
    place: { kind: 'senn', name: 'Senn Library', room: 'Second floor, room 210', virtual: 'https://meet.google.com/qrh-ggsj-wcr' },
    body: 'First meeting of the year. Budget review, the meeting calendar, and what the Title I family engagement money can actually be spent on. Spanish interpretation is standing.',
    rsvp: true
  },
  {
    id: 'home-opener',
    groups: ['athletics'],
    title: 'Home Opener vs. Amundsen',
    date: '2026-08-28', time: '6:30 PM',
    tags: ['social'],
    place: { kind: 'senn', name: 'Senn Field' },
    body: 'Bulldogs open the season at home. Concessions run by the Athletic Boosters, all proceeds to uniforms.',
    rsvp: false
  },
  {
    id: 'fall-fundraiser',
    groups: ['fos', 'arts'],
    title: 'Fall Fundraiser Planning Session',
    date: '2026-09-02', time: '6:00 PM', ends: '7:30 PM',
    tags: ['fundraiser', 'meeting'],
    place: { kind: 'offsite', name: 'Little Red Nest', address: '5717 N Clark St, Chicago IL 60660' },
    body: 'Friends of Senn and the Arts Boosters plan the fall campaign together. Bring ideas and a laptop.',
    rsvp: true
  },
  {
    id: 'kyr-training',
    groups: ['icewatch', 'bac'],
    title: 'Know Your Rights Training (English and Spanish)',
    date: '2026-09-05', time: '10:00 AM', ends: '12:00 PM',
    tags: ['training'],
    place: { kind: 'senn', name: 'Senn Auditorium' },
    body: 'Two hour training, run in both languages at the same time. Free. Printed rights cards go home with everyone who attends.',
    rsvp: true
  },
  {
    id: 'bac-breakfast',
    groups: ['bac'],
    title: 'BAC Welcome Breakfast',
    date: '2026-09-09', time: '8:15 AM',
    tags: ['social', 'meeting'],
    place: { kind: 'senn', name: 'Senn Cafeteria' },
    body: 'Coffee, breakfast, and an introduction to what the Bilingual Advisory Committee does. Interpretation provided.',
    rsvp: true
  },
  {
    id: 'lsc-info',
    groups: ['lsc'],
    title: 'LSC Information Night',
    date: '2026-09-15', time: '6:30 PM',
    tags: ['meeting'],
    place: { kind: 'virtual', name: 'Zoom', virtual: 'https://us06web.zoom.us/j/0000000000' },
    body: 'What the Local School Council does, what the seats are, and how the elections work. Virtual so anyone can drop in.',
    rsvp: false
  },
  {
    id: 'teacher-breakfast',
    groups: ['fos'],
    title: 'Teacher Appreciation Breakfast',
    date: '2026-09-18', time: '7:30 AM',
    tags: ['volunteer'],
    place: { kind: 'senn', name: 'Senn Cafeteria' },
    body: 'We feed the whole staff before first period. Setup starts at 6:45 AM.',
    rsvp: true,
    slots: [
      { label: 'Setup, 6:45 to 7:30 AM', open: 2, filled: 4 },
      { label: 'Serving, 7:30 to 8:15 AM', open: 3, filled: 5 },
      { label: 'Cleanup, 8:15 to 9:00 AM', open: 4, filled: 1 }
    ]
  },
  {
    id: 'concessions',
    groups: ['athletics'],
    title: 'Booster Concessions Volunteer Night',
    date: '2026-09-24', time: '5:30 PM',
    tags: ['volunteer', 'fundraiser'],
    place: { kind: 'senn', name: 'Senn Field House' },
    body: 'Two hour shifts at the stand. No experience needed, we train you in ten minutes. Proceeds fund uniforms.',
    rsvp: true,
    slots: [
      { label: 'First half, 5:30 to 7:00 PM', open: 3, filled: 3 },
      { label: 'Second half, 7:00 to 8:30 PM', open: 5, filled: 1 }
    ]
  }
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
  { group: 'fos',       title: 'Library volunteer day',     ask: 'We need 12 parents to sort and shelve the new collection.', deadline: 'Aug 23',  cta: 'Sign up' },
  { group: 'arts',      title: 'Fall play costume fund',    ask: 'Raising $2,400 for costumes and set materials.',            deadline: 'Sept 15', cta: 'Donate' },
  { group: 'athletics', title: 'Concession stand shifts',   ask: 'Two hour shifts at home games. Proceeds fund uniforms.',    deadline: 'Ongoing', cta: 'Take a shift' },
  { group: 'icewatch',  title: 'Rapid response phone tree', ask: 'Volunteers to hold a slot on the response rotation.',       deadline: 'Ongoing', cta: 'Volunteer' }
];

/* --- Donor wall. Sz asked for this by name. --- */
const DONORS = [
  { name: 'Lobos Pizza',     gave: '30 pizzas for the volunteer day', group: 'fos' },
  { name: 'Bark Bark Club',  gave: 'Athletic gear for the fall season', group: 'athletics' },
  { name: 'Little Red Nest', gave: 'Meeting space, every month',       group: 'fos' },
  { name: 'The Glenwood',    gave: 'Raffle prizes for the spring benefit', group: 'arts' }
];

/* --- Helpers --- */

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(y, m - 1, d).getDay()];
  return `${dow}, ${MONTHS[m - 1]} ${d}`;
}

function groupName(slug)  { return GROUP_BY_SLUG[slug] ? GROUP_BY_SLUG[slug].name : slug; }
function groupFull(slug)  { return GROUP_BY_SLUG[slug] ? GROUP_BY_SLUG[slug].full : slug; }
function groupColor(slug) { return GROUP_BY_SLUG[slug] ? GROUP_BY_SLUG[slug].color : 'var(--ink-40)'; }

function groupsInTier(tier) { return GROUPS.filter(g => g.tier === tier); }
function joinableGroups()   { return GROUPS.filter(g => g.joinable); }

/* Where an event happens, rendered honestly: a real address when it is off
   site, the word Virtual when there is no room to walk into. */
function placeLine(ev) {
  const p = ev.place;
  if (p.kind === 'virtual') return 'Virtual · link in the details';
  if (p.kind === 'offsite') return `${p.name} · ${p.address}`;
  return p.room ? `${p.name} · ${p.room}` : p.name;
}

function mapLink(ev) {
  const p = ev.place;
  if (p.kind === 'offsite') return `https://maps.google.com/?q=${encodeURIComponent(p.address)}`;
  if (p.kind === 'senn')    return `https://maps.google.com/?q=${encodeURIComponent('Nicholas Senn High School, 5900 N Glenwood Ave, Chicago IL 60660')}`;
  return null;
}

function openSlots(ev) {
  if (!ev.slots) return 0;
  return ev.slots.reduce((n, s) => n + s.open, 0);
}

/* --- Shared nav + footer, so there is one copy instead of fourteen.
   group.html mounts these. The homepage directions carry their own. --- */

function renderNav(active) {
  const dd = GROUPS.map(g =>
    `<a href="group.html?g=${g.slug}"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:${g.color};display:inline-block"></span>${g.full}</a>`
  ).join('');

  return `
<nav>
  <div class="nav-inner">
    <a href="${active === 'a' ? 'a.html' : active === 'd' ? 'd.html' : 'b.html'}" class="nav-brand">
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
  <div style="margin-top:0.6rem">
    <a href="https://empactos.com" target="_blank" rel="noopener" aria-label="Runs on EMPACT"
       style="display:inline-block;opacity:0.75">
      <img src="assets/runs-on-empact-white.svg" alt="Runs on EMPACT" style="height:14px;width:auto;display:block">
    </a>
  </div>
</footer>`;
}

function mountShell(active) {
  const navSlot = document.getElementById('nav-slot');
  const footSlot = document.getElementById('footer-slot');
  if (navSlot) navSlot.outerHTML = renderNav(active);
  if (footSlot) footSlot.outerHTML = renderFooter();
}
