/* Senn Parents — data layer, ported from mockups/assets/groups-v2.js
   (the merged direction D). In production every array below is a tab in
   the shared Google Sheet, read through Apps Script. Nothing here is
   hardcoded into the layout: add a row, the page grows. */

export type Tier = {
  slug: string;
  name: string;
  blurb: string;
};

export type Group = {
  slug: string;
  name: string;
  full: string;
  tier: string;
  color: string;
  blurb: string;
  who: string;
  joinable: boolean;
  /* Which sections the group page renders, in order. A section only
     renders if the group has it. */
  sections: string[];
  secretary?: string;
  parent?: string;
  infoOnly?: boolean;
  infoNote?: string;
};

export type EventSlot = { label: string; open: number; filled: number };

export type SennEvent = {
  id: string;
  groups: string[];
  title: string;
  date: string;
  time: string;
  ends?: string;
  tags: string[];
  place: {
    kind: "senn" | "offsite" | "virtual";
    name: string;
    room?: string;
    address?: string;
    virtual?: string;
  };
  body: string;
  rsvp: boolean;
  slots?: EventSlot[];
};

export const TIERS: Tier[] = [
  {
    slug: "governance",
    name: "Governance",
    blurb:
      "Elected and advisory bodies. These groups have a formal say in how the school is run and how money gets spent.",
  },
  {
    slug: "support",
    name: "Support",
    blurb:
      "Fundraising and volunteer groups. These groups raise money, staff events, and back students directly.",
  },
  {
    slug: "safety",
    name: "Safety",
    blurb:
      "Training and rapid response so every family at Senn knows their rights and knows who to call.",
  },
];

export const GROUPS: Group[] = [
  {
    slug: "pac",
    name: "PAC",
    full: "Parent Advisory Council",
    tier: "governance",
    color: "var(--pac)",
    blurb:
      "The parent voice on how Senn spends its Title I family engagement budget.",
    who: "Any Senn parent or guardian. No election required to attend.",
    sections: ["announcements", "events", "about", "efforts", "minutes", "bylaws", "grants", "contact"],
    secretary: "Kathryn Clark",
    joinable: true,
  },
  {
    slug: "lsc",
    name: "LSC",
    full: "Local School Council",
    tier: "governance",
    color: "var(--lsc)",
    blurb:
      "The elected council that approves the school budget, the improvement plan, and the principal contract.",
    who: "Elected seats for parents, community members, teachers, and students.",
    sections: ["about", "contact"],
    infoOnly: true,
    infoNote: "Information only, pending a vote by the parent group.",
    joinable: false,
  },
  {
    slug: "bac",
    name: "BAC",
    full: "Bilingual Advisory Committee",
    tier: "governance",
    color: "var(--bac)",
    blurb:
      "Families of multilingual learners shaping how Senn serves their students.",
    who: "Parents of students in bilingual or EL programs. Interpretation provided.",
    sections: ["announcements", "events", "about", "minutes", "bylaws", "grants", "contact"],
    secretary: "BAC Secretary",
    joinable: true,
  },
  {
    slug: "fos",
    name: "Friends of Senn",
    full: "Friends of Senn",
    tier: "support",
    color: "var(--fos)",
    blurb:
      "Fundraising and direct support for classrooms, teachers, and school programs.",
    who: "Parents, alumni, neighbors, and local businesses.",
    sections: ["announcements", "events", "about", "efforts", "minutes", "bylaws", "grants", "subcommittees", "contact"],
    secretary: "FOS Secretary",
    joinable: true,
  },
  {
    slug: "arts",
    name: "Arts Boosters",
    full: "Senn Arts Boosters",
    tier: "support",
    color: "var(--arts)",
    blurb: "Backing theatre, music, dance, and visual arts at Senn.",
    who: "Families of arts students and anyone who shows up for opening night.",
    sections: ["announcements", "events", "about", "efforts", "contact"],
    secretary: "Arts Boosters Chair",
    parent: "fos",
    joinable: true,
  },
  {
    slug: "athletics",
    name: "Athletic Boosters",
    full: "Senn Athletic Boosters",
    tier: "support",
    color: "var(--athletics)",
    blurb:
      "Uniforms, equipment, concessions, and crowds for every Bulldogs team.",
    who: "Families of athletes and anyone who fills the bleachers.",
    sections: ["announcements", "events", "about", "efforts", "contact"],
    secretary: "Athletic Boosters Chair",
    joinable: true,
  },
  {
    slug: "icewatch",
    name: "Ice Watch",
    full: "Senn Ice Watch",
    tier: "safety",
    color: "var(--icewatch)",
    blurb:
      "Know Your Rights training and rapid response so every family stays safe.",
    who: "Any family who wants to be trained or supported.",
    sections: ["announcements", "events", "about", "kyr", "resources", "contact"],
    secretary: "Ice Watch Coordinator",
    joinable: true,
  },
];

export const GROUP_BY_SLUG: Record<string, Group> = Object.fromEntries(
  GROUPS.map((g) => [g.slug, g])
);

export const TAGS: Record<string, { label: string; color: string }> = {
  meeting: { label: "Meeting", color: "var(--pac)" },
  volunteer: { label: "Volunteer", color: "var(--athletics)" },
  fundraiser: { label: "Fundraiser", color: "var(--fos)" },
  social: { label: "Social", color: "var(--arts)" },
  training: { label: "Training", color: "var(--icewatch)" },
};

export const EVENTS: SennEvent[] = [
  {
    id: "pac-kickoff",
    groups: ["pac"],
    title: "PAC Meeting: Back to School Kickoff",
    date: "2026-08-25",
    time: "7:00 PM",
    ends: "8:30 PM",
    tags: ["meeting"],
    place: {
      kind: "senn",
      name: "Senn Library",
      room: "Second floor, room 210",
      virtual: "https://meet.google.com/qrh-ggsj-wcr",
    },
    body: "First meeting of the year. Budget review, the meeting calendar, and what the Title I family engagement money can actually be spent on. Spanish interpretation is standing.",
    rsvp: true,
  },
  {
    id: "home-opener",
    groups: ["athletics"],
    title: "Home Opener vs. Amundsen",
    date: "2026-08-28",
    time: "6:30 PM",
    tags: ["social"],
    place: { kind: "senn", name: "Senn Field" },
    body: "Bulldogs open the season at home. Concessions run by the Athletic Boosters, all proceeds to uniforms.",
    rsvp: false,
  },
  {
    id: "fall-fundraiser",
    groups: ["fos", "arts"],
    title: "Fall Fundraiser Planning Session",
    date: "2026-09-02",
    time: "6:00 PM",
    ends: "7:30 PM",
    tags: ["fundraiser", "meeting"],
    place: {
      kind: "offsite",
      name: "Little Red Nest",
      address: "5717 N Clark St, Chicago IL 60660",
    },
    body: "Friends of Senn and the Arts Boosters plan the fall campaign together. Bring ideas and a laptop.",
    rsvp: true,
  },
  {
    id: "kyr-training",
    groups: ["icewatch", "bac"],
    title: "Know Your Rights Training (English and Spanish)",
    date: "2026-09-05",
    time: "10:00 AM",
    ends: "12:00 PM",
    tags: ["training"],
    place: { kind: "senn", name: "Senn Auditorium" },
    body: "Two hour training, run in both languages at the same time. Free. Printed rights cards go home with everyone who attends.",
    rsvp: true,
  },
  {
    id: "bac-breakfast",
    groups: ["bac"],
    title: "BAC Welcome Breakfast",
    date: "2026-09-09",
    time: "8:15 AM",
    tags: ["social", "meeting"],
    place: { kind: "senn", name: "Senn Cafeteria" },
    body: "Coffee, breakfast, and an introduction to what the Bilingual Advisory Committee does. Interpretation provided.",
    rsvp: true,
  },
  {
    id: "lsc-info",
    groups: ["lsc"],
    title: "LSC Information Night",
    date: "2026-09-15",
    time: "6:30 PM",
    tags: ["meeting"],
    place: {
      kind: "virtual",
      name: "Zoom",
      virtual: "https://us06web.zoom.us/j/0000000000",
    },
    body: "What the Local School Council does, what the seats are, and how the elections work. Virtual so anyone can drop in.",
    rsvp: false,
  },
  {
    id: "teacher-breakfast",
    groups: ["fos"],
    title: "Teacher Appreciation Breakfast",
    date: "2026-09-18",
    time: "7:30 AM",
    tags: ["volunteer"],
    place: { kind: "senn", name: "Senn Cafeteria" },
    body: "We feed the whole staff before first period. Setup starts at 6:45 AM.",
    rsvp: true,
    slots: [
      { label: "Setup, 6:45 to 7:30 AM", open: 2, filled: 4 },
      { label: "Serving, 7:30 to 8:15 AM", open: 3, filled: 5 },
      { label: "Cleanup, 8:15 to 9:00 AM", open: 4, filled: 1 },
    ],
  },
  {
    id: "concessions",
    groups: ["athletics"],
    title: "Booster Concessions Volunteer Night",
    date: "2026-09-24",
    time: "5:30 PM",
    tags: ["volunteer", "fundraiser"],
    place: { kind: "senn", name: "Senn Field House" },
    body: "Two hour shifts at the stand. No experience needed, we train you in ten minutes. Proceeds fund uniforms.",
    rsvp: true,
    slots: [
      { label: "First half, 5:30 to 7:00 PM", open: 3, filled: 3 },
      { label: "Second half, 7:00 to 8:30 PM", open: 5, filled: 1 },
    ],
  },
];

export const ANNOUNCEMENTS = [
  {
    group: "pac",
    title: "May minutes posted, laptop purchase approved",
    date: "2026-08-08",
    body: "The cabinet and laptop quotes were approved 9 to 0. Full minutes are on the PAC page.",
  },
  {
    group: "fos",
    title: "Classroom grant applications open August 20",
    date: "2026-08-07",
    body: "Teachers can request up to $500 per classroom. Two week window, decisions by mid September.",
  },
  {
    group: "icewatch",
    title: "New Know Your Rights cards, English and Spanish",
    date: "2026-08-05",
    body: "Printed cards are in the main office and at every Ice Watch table. Free, take as many as you need.",
  },
  {
    group: "athletics",
    title: "Fall sports physicals due August 22",
    date: "2026-08-04",
    body: "No physical on file means no practice. The nurse has walk in hours Thursday afternoons.",
  },
  {
    group: "bac",
    title: "Interpretation now standing at every meeting",
    date: "2026-08-01",
    body: "Spanish interpretation is confirmed for all BAC and PAC meetings this year. Other languages on request.",
  },
  {
    group: "arts",
    title: "Season announced: fall play, winter concert, spring showcase",
    date: "2026-07-29",
    body: "Three productions this year plus the spring art walk. Volunteer slots open in September.",
  },
];

export const EFFORTS = [
  {
    group: "fos",
    title: "Library volunteer day",
    ask: "We need 12 parents to sort and shelve the new collection.",
    deadline: "Aug 23",
    cta: "Sign up",
  },
  {
    group: "arts",
    title: "Fall play costume fund",
    ask: "Raising $2,400 for costumes and set materials.",
    deadline: "Sept 15",
    cta: "Donate",
  },
  {
    group: "athletics",
    title: "Concession stand shifts",
    ask: "Two hour shifts at home games. Proceeds fund uniforms.",
    deadline: "Ongoing",
    cta: "Take a shift",
  },
  {
    group: "icewatch",
    title: "Rapid response phone tree",
    ask: "Volunteers to hold a slot on the response rotation.",
    deadline: "Ongoing",
    cta: "Volunteer",
  },
];

export const DONORS = [
  { name: "Lobos Pizza", gave: "30 pizzas for the volunteer day", group: "fos" },
  {
    name: "Bark Bark Club",
    gave: "Athletic gear for the fall season",
    group: "athletics",
  },
  {
    name: "Little Red Nest",
    gave: "Meeting space, every month",
    group: "fos",
  },
  {
    name: "The Glenwood",
    gave: "Raffle prizes for the spring benefit",
    group: "arts",
  },
];

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date(y, m - 1, d).getDay()
  ];
  return `${dow}, ${MONTHS[m - 1]} ${d}`;
}

export function groupName(slug: string) {
  return GROUP_BY_SLUG[slug]?.name ?? slug;
}
export function groupFull(slug: string) {
  return GROUP_BY_SLUG[slug]?.full ?? slug;
}
export function groupColor(slug: string) {
  return GROUP_BY_SLUG[slug]?.color ?? "var(--ink-40)";
}
export function groupsInTier(tier: string) {
  return GROUPS.filter((g) => g.tier === tier);
}
export function joinableGroups() {
  return GROUPS.filter((g) => g.joinable);
}

/* Where an event happens, rendered honestly: a real address when it is off
   site, the word Virtual when there is no room to walk into. */
export function placeLine(ev: SennEvent) {
  const p = ev.place;
  if (p.kind === "virtual") return "Virtual · link in the details";
  if (p.kind === "offsite") return `${p.name} · ${p.address}`;
  return p.room ? `${p.name} · ${p.room}` : p.name;
}

export function mapLink(ev: SennEvent) {
  const p = ev.place;
  if (p.kind === "offsite")
    return `https://maps.google.com/?q=${encodeURIComponent(p.address ?? "")}`;
  if (p.kind === "senn")
    return `https://maps.google.com/?q=${encodeURIComponent(
      "Nicholas Senn High School, 5900 N Glenwood Ave, Chicago IL 60660"
    )}`;
  return null;
}

export function openSlots(ev: SennEvent) {
  if (!ev.slots) return 0;
  return ev.slots.reduce((n, s) => n + s.open, 0);
}

/* --- Seeded group-page content (Sheet rows in production) --- */

export const LEADERS: Record<string, [string, string][]> = {
  pac: [
    ["Chair", "Jason Menard"],
    ["Vice Chair", "Katie Denny"],
    ["Secretary", "Kathryn Clark"],
    ["Outreach", "Steve Larosiliere"],
  ],
  fos: [
    ["President", "TBD"],
    ["Treasurer", "TBD"],
    ["Secretary", "TBD"],
    ["Volunteer Lead", "TBD"],
  ],
  bac: [
    ["Chair", "TBD"],
    ["Vice Chair", "TBD"],
    ["Secretary", "TBD"],
    ["Interpreter Liaison", "TBD"],
  ],
  arts: [
    ["Chair", "TBD"],
    ["Treasurer", "TBD"],
    ["Volunteer Lead", "TBD"],
  ],
  athletics: [
    ["Chair", "TBD"],
    ["Treasurer", "TBD"],
    ["Concessions Lead", "TBD"],
    ["Spirit Lead", "TBD"],
  ],
  icewatch: [
    ["Coordinator", "TBD"],
    ["Training Lead", "TBD"],
    ["Response Lead", "TBD"],
  ],
  lsc: [
    ["Chair", "Vacant"],
    ["Parent Reps", "6 elected seats"],
    ["Community Reps", "2 elected seats"],
    ["Principal", "Ex officio"],
  ],
};

export const MINUTES: Record<string, [string, string][]> = {
  "2026-2027": [
    ["September 2026 meeting minutes", "Posted Sep 2026"],
    ["August 2026 meeting minutes", "Posted Aug 2026"],
  ],
  "2025-2026": [["All 2025-2026 minutes (one doc)", "Updated Jun 2026"]],
};

export const SUBCOMMITTEES: Record<string, [string, string][]> = {
  fos: [
    ["Arts Boosters", "Theatre, music, dance, visual arts"],
    ["Grants Committee", "Reviews classroom requests"],
    ["Events Committee", "Fundraisers and community nights"],
  ],
  pac: [
    ["Budget Committee", "Title I spending recommendations"],
    ["Workshops Committee", "Parent workshop planning"],
  ],
};
