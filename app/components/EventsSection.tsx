import Image from 'next/image';
import { events, type EventItem } from '@/data/events';
import EventsCalendar from './EventsCalendarClient';

function EventCardContent({ event }: { event: EventItem }) {
  return (
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
            {event.monthLabel}
          </div>
          <div className="font-serif text-3xl leading-none text-text-primary mt-0.5">
            {event.dayLabel}
          </div>
        </div>
        <div className="flex flex-col flex-grow min-w-0 border-l border-border pl-4">
          <h3 className="font-serif text-[22px] leading-tight text-text-primary">
            {event.title}
          </h3>
          <div className="text-xs text-text-secondary mt-1.5 flex flex-wrap gap-x-3">
            <span>{event.weekdayLabel}</span>
            <span>{event.time}</span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{event.location}</p>
          <p className="text-sm text-text-secondary mt-3">{event.description}</p>
        </div>
      </div>
    </div>
  );
}

function EventCardWrapper({ event, hidden }: { event: EventItem; hidden: boolean }) {
  const className = hidden ? 'h-full hidden' : 'h-full';
  if (event.href) {
    return (
      <a
        data-event
        data-date={event.date}
        data-month={event.monthKey}
        data-timestamp={event.timestamp}
        href={event.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`block ${className}`}
      >
        <EventCardContent event={event} />
      </a>
    );
  }
  return (
    <div
      data-event
      data-date={event.date}
      data-month={event.monthKey}
      data-timestamp={event.timestamp}
      className={className}
    >
      <EventCardContent event={event} />
    </div>
  );
}

export default function EventsSection() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const initialMonthKey = `${yyyy}-${mm}`;
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const initialMonthLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const eventDates = events.map((e) => e.date);

  const visibleOnFirstPaint = new Set(
    events
      .filter((e) => e.monthKey === initialMonthKey && e.date >= todayStr)
      .map((e) => e.id),
  );
  const anyVisible = visibleOnFirstPaint.size > 0;

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
            <EventsCalendar eventDates={eventDates} />
          </div>

          <div id="events-list">
            <div
              data-empty-state
              className={
                anyVisible
                  ? 'text-center py-16 text-text-secondary hidden'
                  : 'text-center py-16 text-text-secondary'
              }
            >
              No events in {initialMonthLabel}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCardWrapper
                  key={event.id}
                  event={event}
                  hidden={!visibleOnFirstPaint.has(event.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
