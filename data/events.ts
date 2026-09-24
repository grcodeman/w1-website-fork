import eventsData from './events.json';
import { BUILD_SCHEDULE, sessions } from './bronco-build-it';

export interface RawEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  href?: string;
}

export interface EventItem extends RawEvent {
  /** Unix ms timestamp, computed once at module load. */
  timestamp: number;
  /** YYYY-MM key for month filtering without Date objects. */
  monthKey: string;
  /** Display strings precomputed for server rendering. */
  monthLabel: string;
  dayLabel: number;
  weekdayLabel: string;
  year: number;
}

function enrich(raw: RawEvent): EventItem {
  const d = new Date(raw.date + 'T00:00:00');
  return {
    ...raw,
    timestamp: d.getTime(),
    monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    monthLabel: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    dayLabel: d.getDate(),
    weekdayLabel: d.toLocaleDateString('en-US', { weekday: 'long' }),
    year: d.getFullYear(),
  };
}

// Weekly Bronco Build It sessions come from the schedule, not events.json.
const buildSessions: RawEvent[] = sessions.map((s) => ({
  id: `bronco-build-it-${s.date}`,
  title: s.label ? `Bronco Build It: ${s.label}` : 'Bronco Build It',
  date: s.date,
  time: BUILD_SCHEDULE.time,
  location: BUILD_SCHEDULE.location,
  description: 'A weekly workspace for homework, side projects, and launching a business. Show up, build, ship.',
  image: '/images/bronco/bronco3.jpg',
}));

export const events: EventItem[] = [...(eventsData as RawEvent[]), ...buildSessions]
  .map(enrich)
  .sort((a, b) => a.timestamp - b.timestamp);
