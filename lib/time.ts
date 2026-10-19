/* Dates are stored as YYYY-MM-DD in Chicago time; times as "7:00 PM". */

export function chicagoToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(new Date());
}

/** "19:00" (from <input type="time">) to "7:00 PM". */
export function to12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "7:00 PM" back to "19:00" for <input type="time">. */
export function to24h(label: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!match) return "";
  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${match[2]}`;
}

/* The groups a parent picked on the join form, remembered in this browser
   so the calendar can default to just their groups. */
const MY_GROUPS_KEY = "senn-my-groups";

export function loadMyGroups(): string[] {
  try {
    const raw = localStorage.getItem(MY_GROUPS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveMyGroups(groups: string[]) {
  try {
    localStorage.setItem(MY_GROUPS_KEY, JSON.stringify(groups));
  } catch {
    // Private mode or storage full; the filter just won't stick
  }
}
