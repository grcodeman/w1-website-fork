import ecosystemData from '@/data/ecosystem.json';

export default function EcosystemDirectory() {
  return (
    <div className="space-y-16">
      {ecosystemData.regions.map((region) => (
        <section key={region.city}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-serif text-[28px] sm:text-[36px] tracking-tight text-text-primary">
              {region.city}
            </h2>
            {region.status === 'expanding' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-subtle text-wmu-brown">
                Expanding
              </span>
            )}
          </div>

          {region.orgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {region.orgs.map((org) => (
                <a
                  key={org.name}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-warm-white rounded-xl p-5 border border-border cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-sans font-semibold text-text-primary">
                      {org.name}
                    </h3>
                    <svg
                      className="w-4 h-4 text-text-secondary shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">{org.description}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm italic">
              We&apos;re building connections here. Stay tuned.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
