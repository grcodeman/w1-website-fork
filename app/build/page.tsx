import type { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  BUILD_SCHEDULE,
  SCHEDULE_SUMMARY,
  formatSessionDate,
  getNextSession,
  getPastSessions,
  getUpcomingSessions,
  type Session,
} from '@/data/bronco-build-it';
import { ICS_PATH, googleCalendarUrl } from '@/data/bronco-build-it-calendar';

// This page derives "today" from `new Date()`. Without revalidation that's frozen
// at build time, so upcoming/past would stay stuck on the last deploy date.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bronco Build It',
  description: `W1's weekly build session at Western Michigan University: ${SCHEDULE_SUMMARY.charAt(0).toLowerCase()}${SCHEDULE_SUMMARY.slice(1)}. Bring homework, a side project, or a business and ship it alongside other student builders. No RSVP needed.`,
  alternates: { canonical: '/build' },
};

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SessionRow({ session, muted }: { session: Session; muted?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between bg-warm-white rounded-xl px-5 py-4 border border-border${
        muted ? ' opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-gold-bright shrink-0" />
        <div>
          <p className="text-text-primary font-medium">
            <time dateTime={session.date}>{formatSessionDate(session.date)}</time>
          </p>
          {session.label && (
            <p className="text-xs text-gold-bright font-medium mt-0.5">
              {session.label}
            </p>
          )}
        </div>
      </div>
      <span className="text-sm text-text-secondary shrink-0 ml-4">{BUILD_SCHEDULE.time}</span>
    </div>
  );
}

export default function Build() {
  const nextSession = getNextSession();
  const upcoming = getUpcomingSessions();
  // Most recent first.
  const past = getPastSessions().reverse();

  const hasUpcoming = upcoming.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header>
        <Navbar />
      </header>

      <main id="main" className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[800px] mx-auto">
          {/* Page Header */}
          <h1 className="font-serif text-[40px] sm:text-[48px] tracking-tight text-text-primary">
            Bronco Build It
          </h1>
          <p className="mt-2 text-lg text-text-secondary">
            Every {BUILD_SCHEDULE.day} at {BUILD_SCHEDULE.time.toLowerCase().replace(' ', '')}. Show up, build, ship.
          </p>
          <p className="mt-1 text-text-secondary">{BUILD_SCHEDULE.location}</p>

          {/* Featured Next Session */}
          {nextSession && (
            <div className="mt-12">
              <div className="bg-brown-deep rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8">
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-gold-bright text-sm font-semibold uppercase tracking-wider">
                    {hasUpcoming ? 'Next Session' : 'Most Recent Session'}
                  </p>
                  <h2 className="font-serif text-[28px] sm:text-[36px] text-text-on-dark mt-2">
                    <time dateTime={nextSession.date}>
                      {formatSessionDate(nextSession.date)}
                    </time>
                  </h2>
                  <p className="text-text-on-dark/70 mt-1 text-lg">
                    {BUILD_SCHEDULE.time} · {BUILD_SCHEDULE.location}
                  </p>
                  {nextSession.label && (
                    <p className="text-gold-bright mt-2 font-medium">{nextSession.label}</p>
                  )}
                  <p className="text-text-on-dark/70 mt-4">
                    No RSVP needed. Just show up.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <a
                      href={googleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 bg-wmu-gold text-brown-deep font-semibold rounded-lg hover:bg-gold-bright transition-colors text-sm sm:text-base"
                    >
                      <CalendarIcon />
                      Add to Google Calendar
                    </a>
                    <a
                      href={ICS_PATH}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 border border-text-on-dark/30 text-text-on-dark font-semibold rounded-lg hover:bg-text-on-dark/10 transition-colors text-sm sm:text-base"
                    >
                      <CalendarIcon />
                      Apple / Outlook
                    </a>
                  </div>
                  <p className="text-sm text-text-on-dark/60 mt-3">
                    Adds every {BUILD_SCHEDULE.day} through {formatShortDate(BUILD_SCHEDULE.endDate)}.
                  </p>
                  <a
                    href="https://discord.com/invite/G9yE5s6NFM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-gold-bright hover:underline"
                  >
                    Join the Discord for updates
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Photo Grid */}
                <div className="hidden md:grid grid-cols-[1.4fr_1fr] grid-rows-2 gap-2 w-[380px] h-[200px] shrink-0">
                  <div className="row-span-2 relative rounded-lg overflow-hidden">
                    <Image
                      src="/images/bronco/bronco3.jpg"
                      alt="Whiteboard session at Bronco Build It"
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src="/images/bronco/bronco1.jpg"
                      alt="Members working at Bronco Build It"
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src="/images/bronco/bronco2.jpg"
                      alt="Members at Bronco Build It"
                      fill
                      className="object-cover object-[center_70%]"
                      sizes="140px"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Log */}
          <div className="mt-16">
            <h2 className="font-serif text-[24px] sm:text-[28px] text-text-primary">
              All Sessions
            </h2>

            {/* Upcoming sessions */}
            {upcoming.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                  Upcoming
                </h3>
                <div className="space-y-3">
                  {upcoming.map((session) => (
                    <SessionRow key={session.date} session={session} />
                  ))}
                </div>
              </div>
            )}

            {/* Past sessions */}
            {past.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                  Past
                </h3>
                <div className="space-y-3">
                  {past.map((session) => (
                    <SessionRow key={session.date} session={session} muted />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
