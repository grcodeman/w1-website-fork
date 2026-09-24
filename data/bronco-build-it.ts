// Bronco Build It runs on a fixed weekly schedule, so sessions are generated
// from this config instead of being listed by hand. To change the schedule,
// edit BUILD_SCHEDULE. To cancel a week, add its date to skipDates.
export const BUILD_SCHEDULE = {
  day: 'Friday',
  weekday: 5,                          // 0 = Sunday ... 6 = Saturday
  time: '6:30 PM',
  location: 'WMU Student Center RSO Office',
  startDate: '2026-09-25',             // first session on this schedule
  endDate: '2026-12-11',               // last session of the semester
  skipDates: [] as string[],           // "YYYY-MM-DD" dates with no session
};

export const SCHEDULE_SUMMARY = `Every ${BUILD_SCHEDULE.day} at ${BUILD_SCHEDULE.time} in the ${BUILD_SCHEDULE.location}`;

export interface Session {
  date: string;       // ISO date string "YYYY-MM-DD"
  label?: string;     // Optional: special session name (e.g., "Demo Day")
}

// Optional names for special sessions, keyed by date.
const sessionLabels: Record<string, string> = {};

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildSessions(): Session[] {
  const { weekday, startDate, endDate, skipDates } = BUILD_SCHEDULE;
  const d = new Date(startDate + 'T00:00:00');
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7));
  const end = new Date(endDate + 'T00:00:00');

  const result: Session[] = [];
  for (; d <= end; d.setDate(d.getDate() + 7)) {
    const date = toIso(d);
    if (skipDates.includes(date)) continue;
    result.push(sessionLabels[date] ? { date, label: sessionLabels[date] } : { date });
  }
  return result;
}

export const sessions: Session[] = buildSessions();

function todayIso(): string {
  return toIso(new Date());
}

export function getUpcomingSessions(): Session[] {
  const today = todayIso();
  return sessions.filter((s) => s.date >= today);
}

export function getPastSessions(): Session[] {
  const today = todayIso();
  return sessions.filter((s) => s.date < today);
}

export function getNextSession(): Session | null {
  const upcoming = getUpcomingSessions();
  if (upcoming.length > 0) return upcoming[0];

  // Fallback: return the most recent past session
  return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}

export function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
