import { BUILD_SCHEDULE, getUpcomingSessions, sessions } from './bronco-build-it';

// Calendar links for the weekly session: a Google Calendar "add event" URL and
// an iCalendar (.ics) file for Apple Calendar, Outlook, and everything else.
// Both are a single recurring event built from BUILD_SCHEDULE.

export const ICS_PATH = '/build/bronco-build-it.ics';

const TITLE = 'Bronco Build It';
const DETAILS =
  'W1 weekly build session. Bring homework, a side project, or a business. Show up, build, ship. No RSVP needed. https://www.w1build.com/build';

// "2026-09-25" + "18:30" (+ minutes) -> "20260925T183000" in local wall-clock time.
function localStamp(date: string, hhmm: string, addMinutes = 0): string {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = hhmm.split(':').map(Number);
  const t = new Date(Date.UTC(y, mo - 1, d, h, mi + addMinutes));
  return t.toISOString().slice(0, 19).replace(/[-:]/g, '');
}

function utcStamp(t: Date): string {
  return t.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z';
}

// First session a new subscriber should get: the next upcoming one, so their
// calendar isn't filled with past weeks.
function firstSessionDate(): string {
  const upcoming = getUpcomingSessions();
  return (upcoming[0] ?? sessions[sessions.length - 1] ?? { date: BUILD_SCHEDULE.startDate }).date;
}

function rrule(): string {
  // UNTIL is UTC. 04:59:59Z the day after endDate is still endDate's evening
  // in Eastern time, so the last session is always included.
  const [y, m, d] = BUILD_SCHEDULE.endDate.split('-').map(Number);
  const until = utcStamp(new Date(Date.UTC(y, m - 1, d + 1, 4, 59, 59)));
  const byDay = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][BUILD_SCHEDULE.weekday];
  return `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}`;
}

export function googleCalendarUrl(): string {
  const { startTime, durationMinutes, timeZone, location } = BUILD_SCHEDULE;
  const date = firstSessionDate();
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${localStamp(date, startTime)}/${localStamp(date, startTime, durationMinutes)}`,
    ctz: timeZone,
    details: DETAILS,
    location,
    recur: rrule(),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// iCalendar lines must be folded at 75 octets; continuation lines start with a space.
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  out.push(rest);
  return out.join('\r\n');
}

// Eastern time zone definition, so every calendar app agrees on DST.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:America/Detroit',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0400',
  'TZNAME:EDT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0400',
  'TZOFFSETTO:-0500',
  'TZNAME:EST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

export function buildIcs(): string {
  const { startTime, durationMinutes, timeZone, location, skipDates } = BUILD_SCHEDULE;
  const date = firstSessionDate();
  const tz = `TZID=${timeZone}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//W1 @ WMU//Bronco Build It//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...VTIMEZONE,
    'BEGIN:VEVENT',
    // Stable per schedule start so re-importing updates instead of duplicating.
    `UID:bronco-build-it-${BUILD_SCHEDULE.startDate}@w1build.com`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART;${tz}:${localStamp(date, startTime)}`,
    `DTEND;${tz}:${localStamp(date, startTime, durationMinutes)}`,
    rrule(),
    ...skipDates.map((d) => `EXDATE;${tz}:${localStamp(d, startTime)}`),
    `SUMMARY:${escapeText(TITLE)}`,
    `DESCRIPTION:${escapeText(DETAILS)}`,
    `LOCATION:${escapeText(location)}`,
    'URL:https://www.w1build.com/build',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
