'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import {
  events,
  parseEventDate,
  isSameDay,
  getEventDates,
  type EventItem,
} from '@/data/events';

function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function EventCard({ event }: { event: EventItem }) {
  const eventDate = parseEventDate(event);
  const monthLabel = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayLabel = eventDate.getDate();
  const weekdayLabel = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

  const cardInner = (
    <div className="bg-warm-white rounded-2xl overflow-hidden border border-border h-full flex flex-col">
      {event.image && (
        <div className="relative aspect-video">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="p-5 sm:p-6 flex gap-4 flex-grow">
        <div className="flex flex-col items-center justify-start shrink-0 w-14 pt-1">
          <div className="text-[11px] font-semibold tracking-wider text-gold-bright uppercase">
            {monthLabel}
          </div>
          <div className="font-serif text-3xl leading-none text-text-primary mt-0.5">
            {dayLabel}
          </div>
        </div>
        <div className="flex flex-col flex-grow min-w-0 border-l border-border pl-4">
          <h3 className="font-serif text-[22px] leading-tight text-text-primary">
            {event.title}
          </h3>
          <div className="text-xs text-text-secondary mt-1.5 flex flex-wrap gap-x-3">
            <span>{weekdayLabel}</span>
            <span>{event.time}</span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{event.location}</p>
          <p className="text-sm text-text-secondary mt-3">{event.description}</p>
        </div>
      </div>
    </div>
  );

  if (event.href) {
    return (
      <a href={event.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardInner}
      </a>
    );
  }
  return cardInner;
}

export default function EventsSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const eventDates = useMemo(() => getEventDates(), []);

  const visibleEvents = useMemo(() => {
    if (selectedDate) {
      return events.filter((e) => isSameDay(parseEventDate(e), selectedDate));
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter((e) => {
        const d = parseEventDate(e);
        if (d < today) return false;
        return (
          d.getFullYear() === displayMonth.getFullYear() &&
          d.getMonth() === displayMonth.getMonth()
        );
      })
      .sort((a, b) => parseEventDate(a).getTime() - parseEventDate(b).getTime());
  }, [selectedDate, displayMonth]);

  const monthLabel = displayMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section id="events" className="py-20 sm:py-28 px-4 bg-cream">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10 md:mb-14">
          <h2 className="font-serif text-4xl sm:text-5xl text-text-primary">Upcoming Events</h2>
          <p className="text-text-secondary mt-2 max-w-2xl">
            Startup events happening around us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-14">
          <div className="lg:sticky lg:top-28 self-start">
            <div className="bg-warm-white rounded-2xl border border-border p-5 shadow-sm">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={displayMonth}
                onMonthChange={setDisplayMonth}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{ hasEvent: 'rdp-has-event' }}
              />
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(undefined)}
                  className="mt-4 w-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover-bg border border-border rounded-lg py-2.5 transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          <div>
            {visibleEvents.length === 0 ? (
              <div className="text-center py-16 text-text-secondary">
                {selectedDate
                  ? `No events on ${formatLongDate(selectedDate)}`
                  : `No events in ${monthLabel}`}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {visibleEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
