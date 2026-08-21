import { useEffect } from 'react';
import { PageHero, FeatureSection } from '../components/Shared';

export const Principles = () => {
  useEffect(() => {
    document.title = "Our Principles — VaultScope";
  }, []);

  return (
    <div className="flex flex-col w-full">
      <PageHero
        title="The principles behind VaultScope."
        description="Software should respect the people who use it. We build products based on privacy, transparency, and user control."
      />

      <FeatureSection
        title="Privacy"
        description="Privacy should influence how software is designed — not just how it is documented. Software should respect user privacy and avoid unnecessary data collection. We try to collect less, expose less, and respect more."
      />

      <FeatureSection
        title="Transparency"
        description="Users should be able to understand what the software does, how it works, and how their data is handled. We believe in building software that isn't a black box."
      />

      <FeatureSection
        title="Open Source"
        description="We believe in opening our software where it creates meaningful value for users and the community. VaultScope believes in open-source software where technically, economically and strategically possible."
      />

      <FeatureSection
        title="Control"
        description="Users should have meaningful control over the software they use and, where applicable, how and where it is operated. Software should work for you, not restrict you."
      />
    </div>
  );
};
