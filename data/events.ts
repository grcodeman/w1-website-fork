import eventsData from './events.json';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  href?: string;
}

export const events: EventItem[] = eventsData as EventItem[];

export function parseEventDate(event: EventItem): Date {
  return new Date(event.date + 'T00:00:00');
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getUpcomingEvents(list: EventItem[] = events): EventItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return list
    .filter((e) => parseEventDate(e) >= today)
    .sort((a, b) => parseEventDate(a).getTime() - parseEventDate(b).getTime());
}

export function getEventDates(list: EventItem[] = events): Date[] {
  return list.map(parseEventDate);
}
