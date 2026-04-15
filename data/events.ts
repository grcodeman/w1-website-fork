import eventsData from './events.json';

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
  };
}

export const events: EventItem[] = (eventsData as RawEvent[])
  .map(enrich)
  .sort((a, b) => a.timestamp - b.timestamp);
