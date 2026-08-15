import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EcosystemDirectory from '../components/EcosystemDirectory';

export const metadata: Metadata = {
  title: 'Midwest Startup Ecosystem',
  description:
    'A directory of the startup organizations W1 connects students to, from Kalamazoo (StartupZoo, Starting Gate, Cultivate269, Tsunami Lab, the SBDC at WMU and more) to Grand Rapids, with Battle Creek, Holland, Chicago, and Detroit next.',
  alternates: { canonical: '/ecosystem' },
};

export default function Ecosystem() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header>
        <Navbar />
      </header>

      <main id="main" className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="font-serif text-[40px] sm:text-[48px] tracking-tight text-text-primary">
            Ecosystem
          </h1>
          <p className="mt-2 text-lg text-text-secondary">
            The Midwest startup network we're exploring - and we keep expanding.
          </p>

          <div className="mt-12">
            <EcosystemDirectory />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
