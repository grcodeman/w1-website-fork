import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import resources from '@/data/resources.json';

export default function Learn() {
  const featured = resources.filter((r) => r.featured);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold tracking-[0.18em] text-gold-bright uppercase">
              Resources
            </div>
            <h1 className="font-serif text-[40px] sm:text-[56px] leading-[1.05] tracking-tight text-text-primary mt-3">
              Learn how to build.
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              A short list of programs we've vetted. Start here to learn the fundamentals of
              shipping a product and running a business. More resources on the way.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-warm-white rounded-2xl p-7 sm:p-8 border border-border transition-colors hover:border-gold-bright"
              >
                {resource.image && (
                  <div className="relative w-14 h-14 mb-6">
                    <Image
                      src={resource.image}
                      alt={`${resource.title} logo`}
                      fill
                      className="object-contain"
                      sizes="56px"
                    />
                  </div>
                )}
                <h2 className="font-serif text-[26px] sm:text-[30px] leading-tight text-text-primary">
                  {resource.title}
                </h2>
                <p className="text-text-secondary mt-3 flex-grow">{resource.description}</p>
                <div className="mt-8 flex items-center gap-1.5 text-gold-bright text-sm font-medium">
                  <span>Start learning</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-border max-w-2xl">
            <h3 className="font-serif text-xl text-text-primary">Know a great resource?</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Send suggestions to{' '}
              <a
                href="mailto:w1@student.groups.wexchange.wmich.edu"
                className="text-gold-bright hover:underline"
              >
                w1@student.groups.wexchange.wmich.edu
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
