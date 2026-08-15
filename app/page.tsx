import type { Metadata } from 'next';
import { events } from '@/data/events';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PillarCard from './components/PillarCard';
import BroncoBuildIt from './components/BroncoBuildIt';
import EventsSection from './components/EventsSection';
import RotatingBadge from './components/RotatingBadge';

// EventsSection derives "today" from `new Date()`. Without revalidation that's
// frozen at build time, so the server-rendered events list would stay stuck on
// whatever month the site was last deployed in. Refresh the static HTML hourly.
export const revalidate = 3600;

// Title stays the layout default; only the canonical is page-specific.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const absolute = (url: string) =>
  url.startsWith('/') ? `https://www.w1build.com${url}` : url;

// "5:00 PM" + "2026-09-22" -> "2026-09-22T17:00:00-04:00", with the Michigan
// UTC offset (EST/EDT) resolved per-date so DST transitions stay correct.
const startDateISO = (date: string, time: string) => {
  const m = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return date;
  const hour = (Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Detroit',
    timeZoneName: 'longOffset',
  })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === 'timeZoneName')!
    .value.replace('GMT', '');
  return `${date}T${String(hour).padStart(2, '0')}:${m[2]}:00${offset || 'Z'}`;
};

const eventsSchema = {
  '@context': 'https://schema.org',
  '@graph': events.map((event) => ({
    '@type': 'Event',
    name: event.title,
    startDate: startDateISO(event.date, event.time),
    description: event.description,
    location: {
      '@type': 'Place',
      name: event.location,
      address: event.location,
    },
    ...(event.href ? { url: event.href } : {}),
    ...(event.image ? { image: absolute(event.image) } : {}),
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />
      <header>
        <Navbar />
      </header>

      <RotatingBadge text="EVENTS" scrollTargetId="events" />

      <main id="main" className="flex-grow">
        <Hero />

        <section className="py-20 sm:py-28 px-4" aria-labelledby="pillars-heading">
          <h2 id="pillars-heading" className="sr-only">What W1 does</h2>
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <BroncoBuildIt />

            <PillarCard
              id="learn"
              title="Learn"
              description="Resources to go from zero to building."
              image="/images/cards/w1_learn.avif"
              href="/learn"
            />

            <PillarCard
              id="ecosystem"
              title="Ecosystem"
              description="We connect students to the Midwest startup network - and we keep expanding."
              image="/images/cards/w1_ecosystem.avif"
              href="/ecosystem"
            />
          </div>
        </section>

        <EventsSection />
      </main>

      <Footer />
    </div>
  );
}
