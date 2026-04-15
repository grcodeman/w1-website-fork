'use client';

import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

interface Props {
  /** Unix ms timestamps of every event date, precomputed on the server. */
  eventTimestamps: number[];
  /** YYYY-MM of the calendar's initial month. */
  initialMonthKey: string;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function dayKey(d: Date): string {
  return `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatMonthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function EventsCalendar({ eventTimestamps, initialMonthKey }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    const [y, m] = initialMonthKey.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  // DayPicker needs Date objects. Reconstruct once from the serialized prop.
  const eventDatesRef = useRef<Date[] | null>(null);
  if (eventDatesRef.current === null) {
    eventDatesRef.current = eventTimestamps.map((t) => new Date(t));
  }

  useEffect(() => {
    const list = document.getElementById('events-list');
    if (!list) return;

    const cards = list.querySelectorAll<HTMLElement>('[data-event]');
    const emptyMsg = list.querySelector<HTMLElement>('[data-empty-state]');

    let shown = 0;
    if (selectedDate) {
      const key = dayKey(selectedDate);
      cards.forEach((el) => {
        const match = el.dataset.date === key;
        el.classList.toggle('hidden', !match);
        if (match) shown += 1;
      });
      if (emptyMsg) {
        emptyMsg.textContent = `No events on ${formatLongDate(selectedDate)}`;
      }
    } else {
      const key = monthKey(displayMonth);
      const todayStr = dayKey(new Date());
      cards.forEach((el) => {
        const cardMonth = el.dataset.month;
        const cardDate = el.dataset.date ?? '';
        const match = cardMonth === key && cardDate >= todayStr;
        el.classList.toggle('hidden', !match);
        if (match) shown += 1;
      });
      if (emptyMsg) {
        emptyMsg.textContent = `No events in ${formatMonthLabel(key)}`;
      }
    }

    if (emptyMsg) emptyMsg.classList.toggle('hidden', shown > 0);
  }, [selectedDate, displayMonth]);

  return (
    <div className="bg-warm-white rounded-2xl border border-border p-5 shadow-sm">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        month={displayMonth}
        onMonthChange={setDisplayMonth}
        modifiers={{ hasEvent: eventDatesRef.current }}
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
  );
}
