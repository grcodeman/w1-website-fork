import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortfolioCard from '../components/PortfolioCard';
import portfolioData from '@/data/portfolio.json';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Startups built by W1 members at Western Michigan University, including VolleyNet, Shelf, Quever, GraduAI, Rooted, and Lumis.',
  alternates: { canonical: '/portfolio' },
};

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'W1 Portfolio',
  description: 'Startups built by W1 members.',
  itemListElement: portfolioData.map((startup, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Organization',
      name: startup.name,
      url: startup.url,
      image: `https://www.w1build.com${startup.image}`,
    },
  })),
};

export default function Portfolio() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <header>
        <Navbar />
      </header>

      <main id="main" className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="font-serif text-[40px] sm:text-[48px] tracking-tight text-text-primary">
            Portfolio
          </h1>
          <p className="mt-2 text-lg text-text-secondary">
            Startups built by W1 members.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {portfolioData.map((startup) => (
              <PortfolioCard key={startup.name} {...startup} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-text-secondary">
              Building something?{' '}
              <Link href="/" className="text-gold-bright hover:underline font-medium">
                Join W1
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
