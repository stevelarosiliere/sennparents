// Senn PAC meeting schedule, 2026-27. Source: AP Melody Littlefair's calendar invites (9/23/26).
// To update: edit PAC_MEETINGS. Pages pick the next upcoming date on their own.
// Set `location` on a meeting once it's known; otherwise it shows as TBD.
// public/senn-pac-2026-27.ics holds the same dates for "add all to calendar".

export type PacMeeting = { date: string; location?: string };

export const PAC_MEETINGS: PacMeeting[] = [
  { date: "2026-09-22" },
  { date: "2026-10-13" },
  { date: "2026-11-10" },
  { date: "2026-12-08" },
  { date: "2027-01-12" },
  { date: "2027-02-09" },
  { date: "2027-03-09" },
  { date: "2027-04-20" },
  { date: "2027-05-11" },
  { date: "2027-06-08" },
];

export const PAC_ICS = "/senn-pac-2026-27.ics";
const START = "19:00";
const END = "20:00"; // Central Time
const SENN = "Nicholas Senn High School, 5900 N Glenwood Ave, Chicago, IL 60660";

/** First meeting on or after `today` (YYYY-MM-DD), or null once the year is over. */
export function nextPacMeeting(today: string) {
  return PAC_MEETINGS.find((m) => m.date >= today) ?? null;
}

// Chicago is UTC-5 in daylight time (2nd Sunday of March to 1st Sunday of November), UTC-6 otherwise
function nthSunday(y: number, month: number, n: number) {
  const first = new Date(Date.UTC(y, month, 1)).getUTCDay();
  return 1 + ((7 - first) % 7) + (n - 1) * 7;
}

function utcStamp(date: string, hhmm: string) {
  const [y, mo, day] = date.split("-").map(Number);
  const m = mo - 1;
  const cdt =
    (m > 2 && m < 10) ||
    (m === 2 && day >= nthSunday(y, 2, 2)) ||
    (m === 10 && day < nthSunday(y, 10, 1));
  const [h, mi] = hhmm.split(":").map(Number);
  const u = new Date(Date.UTC(y, m, day, h + (cdt ? 5 : 6), mi));
  return u.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function pacGcalLink(m: PacMeeting, title: string, details: string) {
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${utcStamp(m.date, START)}/${utcStamp(m.date, END)}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(m.location ?? SENN)}`
  );
}

/** "martes, 13 de octubre de 2026" style label, first letter capitalized. */
export function fmtPacDate(
  date: string,
  locale: string,
  opts: Intl.DateTimeFormatOptions,
) {
  const [y, m, d] = date.split("-").map(Number);
  const s = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    ...opts,
    timeZone: "UTC",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
