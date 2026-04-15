import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PillarCard from './components/PillarCard';
import BroncoBuildIt from './components/BroncoBuildIt';
import EventsSection from './components/EventsSection';
import RotatingBadge from './components/RotatingBadge';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <RotatingBadge text="EVENTS" scrollTargetId="events" />

      <main className="flex-grow">
        <Hero />

        <section className="py-20 sm:py-28 px-4">
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
