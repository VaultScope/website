import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';

const TEAM_MEMBERS = [
  {
    username: 'semiconstructor',
    name: 'Anton (Tony)',
    role: 'Founder & TD & Core Maintainer',
    email: 'tony@vaultscope.de',
    github: 'semi-constructor',
    website: 'https://semiconstructor.com',
    discordId: '931870926797160538'
  },
  {
    username: 'veroxjs',
    name: 'Marek',
    role: 'Technical Support',
    email: 'marek@vaultscope.de',
    github: 'veroxjs',
    website: '',
    discordId: '429956721084203008'
  },
  {
    username: 'altifyx',
    name: 'Jason',
    role: 'Technical Support & Internal Application Development',
    email: 'jason@vaultscope.de',
    github: 'altifyx',
    website: '',
    discordId: '759037138929975297'
  },
  {
    username: 'tittysou',
    name: 'Charlie',
    role: 'General Support',
    email: 'charlie@vaultscope.de',
    github: '',
    website: 'https://titsou.com',
    discordId: '1099359826699620453'
  }
];

export const Team = () => {
  useEffect(() => {
    document.title = 'Team | VaultScope';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Meet the VaultScope team.');
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Company' }, { label: 'Team' }]} />
      </div>
      <PageHero
        eyebrow="OUR TEAM"
        title="Meet the people behind VaultScope"
        description="We are a team of dedicated engineers and support staff passionate about providing top-tier infrastructure."
        align="left"
      />

      <section className="py-20 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.username} className="border border-border p-8 bg-foreground/[0.015] flex flex-col md:flex-row gap-6 items-start">
                {/* Fallback to GitHub avatar or unavatar proxy */}
                <div className="shrink-0 w-24 h-24 border border-border bg-background overflow-hidden">
                  <img
                    src={`https://unavatar.io/${member.github ? `github/${member.github}` : `discord/${member.discordId}`}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${member.username}`}
                    alt={`${member.name} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                       // Extremely generic fallback if unavatar fails
                       (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${member.username}`;
                    }}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-medium tracking-tight text-foreground">{member.name} <span className="text-sm font-normal text-muted-foreground ml-2">@{member.username}</span></h3>
                  <p className="text-xs font-medium text-foreground/50 uppercase tracking-widest mt-1 mb-4">{member.role}</p>
                  
                  <div className="flex flex-col gap-2 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <span className="w-16 font-mono text-xs text-foreground/40">Email</span>
                      <a href={`mailto:${member.email}`} className="hover:text-foreground transition-colors">{member.email}</a>
                    </div>
                    {member.github && (
                      <div className="flex items-center gap-2">
                        <span className="w-16 font-mono text-xs text-foreground/40">GitHub</span>
                        <a href={`https://github.com/${member.github}`} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">{member.github}</a>
                      </div>
                    )}
                    {member.website && (
                      <div className="flex items-center gap-2">
                        <span className="w-16 font-mono text-xs text-foreground/40">Website</span>
                        <a href={member.website} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">{member.website.replace('https://', '')}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
