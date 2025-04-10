import React from 'react';
import AboutHero from './AboutHero';
import MissionSection from './MissionSection';
import StatsSection from './StatsSection';
import TeamSection from './TeamSection';


export default function AboutPage() {
  return (
    <div className="bg-white">
      <AboutHero />
      <MissionSection />
      <StatsSection />
      <TeamSection />
    </div>
  );
};
