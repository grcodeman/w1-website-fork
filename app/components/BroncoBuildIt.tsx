import { BUILD_SCHEDULE, getNextSession, formatSessionDate } from '@/data/bronco-build-it';
import PillarCard from './PillarCard';

export default function BroncoBuildIt() {
  const session = getNextSession();
  const footnote = session ? `Next session: ${formatSessionDate(session.date)}` : undefined;

  return (
    <PillarCard
      id="bronco-build-it"
      title="Bronco Build It"
      description={`Every ${BUILD_SCHEDULE.day} at ${BUILD_SCHEDULE.time.toLowerCase().replace(' ', '')}. Show up, build, ship.`}
      image="/images/cards/w1_build.avif"
      href="/build"
      footnote={footnote}
    />
  );
}
