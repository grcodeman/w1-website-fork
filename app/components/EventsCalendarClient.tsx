'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const EventsCalendar = dynamic(() => import('./EventsCalendar'), {
  ssr: false,
});

function Skeleton() {
  return (
    <div className="bg-warm-white rounded-2xl border border-border shadow-sm h-[380px]">
      <span className="sr-only">Loading events calendar</span>
    </div>
  );
}

export default function EventsCalendarClient(props: {
  eventDates: string[];
}) {
  return (
    <Suspense fallback={<Skeleton />}>
      <EventsCalendar {...props} />
    </Suspense>
  );
}
