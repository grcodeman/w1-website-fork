import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sessionLinks, formatSessionDate, getNextSession } from '@/data/bronco-build-it-links';

export default function Build() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextSession = getNextSession();

  const upcoming = sessionLinks.filter((s) => {
    const d = new Date(s.date + 'T00:00:00');
    return d >= today;
  });

  const hasUpcoming = upcoming.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[800px] mx-auto">
          {/* Page Header */}
          <h1 className="font-serif text-[40px] sm:text-[48px] tracking-tight text-text-primary">
            Bronco Build It
          </h1>
          <p className="mt-2 text-lg text-text-secondary">
            Every Sunday at 2:30pm. Show up, build, ship.
          </p>

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
                    {formatSessionDate(nextSession.date)}
                  </h2>
                  <p className="text-text-on-dark/70 mt-1 text-lg">2:30 PM</p>
                  {nextSession.label && (
                    <p className="text-gold-bright mt-2 font-medium">{nextSession.label}</p>
                  )}
                  <a
                    href={nextSession.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-4 sm:px-6 py-3 bg-wmu-gold text-brown-deep font-semibold rounded-lg hover:bg-gold-bright transition-colors text-sm sm:text-base"
                  >
                    RSVP on ExperienceWMU
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                  Upcoming
                </p>
                <div className="space-y-3">
                  {upcoming.map((session) => (
                    <div
                      key={session.date}
                      className="flex items-center justify-between bg-warm-white rounded-xl px-5 py-4 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold-bright shrink-0" />
                        <div>
                          <p className="text-text-primary font-medium">
                            {formatSessionDate(session.date)}
                          </p>
                          {session.label && (
                            <p className="text-xs text-gold-bright font-medium mt-0.5">
                              {session.label}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={session.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gold-bright hover:underline flex items-center gap-1 shrink-0 ml-4"
                      >
                        RSVP
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
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
