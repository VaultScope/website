import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe, Mail, Code2, Server, Terminal, Cpu } from 'lucide-react';
import { useLanguage } from '../i18n';

interface TeamMember {
  name: string;
  handle: string;
  initials: string;
  roleEn: string;
  roleDe: string;
  bioEn: string;
  bioDe: string;
  focusEn: string[];
  focusDe: string[];
  icon: typeof Code2;
  accentGradient: string;
  github: string;
  website?: string;
  websiteLabel?: string;
  email: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Anton Schmidt',
    handle: '@semiconstructor',
    initials: 'AS',
    roleEn: 'Founder',
    roleDe: 'Gründer',
    bioEn:
      'Founder of VaultScope — leads architecture and engineering across the Pegasus platform, VAMOS, CAMOS, and core infrastructure in Germany.',
    bioDe:
      'Gründer von VaultScope — leitet Architektur und Entwicklung der Pegasus-Plattform, VAMOS, CAMOS sowie der Kerninfrastruktur in Deutschland.',
    focusEn: ['Platform Architecture', 'Infrastructure', 'Pegasus & VAMOS'],
    focusDe: ['Plattform-Architektur', 'Infrastruktur', 'Pegasus & VAMOS'],
    icon: Code2,
    accentGradient: 'from-[#56369C]/14 via-[#56369C]/5 to-transparent',
    github: 'https://github.com/semiconstructor',
    email: 'tony@vaultscope.de',
  },
  {
    name: 'Marek M.',
    handle: '@veroxjs',
    initials: 'MM',
    roleEn: 'Systems & Infrastructure Engineer',
    roleDe: 'Systems & Infrastructure Engineer',
    bioEn:
      'Designs and operates VaultScope’s physical servers, Linux systems, networking, and encrypted storage infrastructure.',
    bioDe:
      'Plant und betreibt die physischen Server, Linux-Systeme, Netzwerke und die verschlüsselte Speicherinfrastruktur von VaultScope.',
    focusEn: ['Server Hardware', 'Linux & Storage', 'Network Security'],
    focusDe: ['Server-Hardware', 'Linux & Speicher', 'Netzwerksicherheit'],
    icon: Server,
    accentGradient: 'from-[#4B328A]/14 via-[#56369C]/5 to-transparent',
    github: 'https://github.com/veroxjs',
    email: 'marek@vaultscope.de',
  },
  {
    name: 'Jason T.',
    handle: '@altifyx',
    initials: 'JT',
    roleEn: 'Backend & Platform Developer',
    roleDe: 'Backend- & Plattform-Entwickler',
    bioEn:
      'Develops backend services, APIs, and automation workflows across VAMOS, CAMOS, and VaultScope’s cloud provisioning stack.',
    bioDe:
      'Entwickelt Backend-Dienste, APIs und Automatisierungs-Workflows für VAMOS, CAMOS und den Cloud-Provisioning-Stack von VaultScope.',
    focusEn: ['Backend Systems', 'API Engineering', 'Automation'],
    focusDe: ['Backend-Systeme', 'API-Entwicklung', 'Automatisierung'],
    icon: Cpu,
    accentGradient: 'from-[#5E3CA8]/12 via-[#56369C]/4 to-transparent',
    github: 'https://github.com/altifyx',
    email: 'jason@vaultscope.de',
  },
  {
    name: 'Charlie P.',
    handle: '@titsoujs',
    initials: 'CP',
    roleEn: 'Full-Stack Developer',
    roleDe: 'Full-Stack-Entwickler',
    bioEn:
      'Builds platform features, internal tools, and integrations across VaultScope’s web applications and customer interfaces.',
    bioDe:
      'Entwickelt Plattform-Funktionen, interne Werkzeuge und Integrationen für die Web-Anwendungen und Kundenoberflächen von VaultScope.',
    focusEn: ['Web Applications', 'Platform Tooling', 'Integrations'],
    focusDe: ['Web-Anwendungen', 'Plattform-Tools', 'Integrationen'],
    icon: Terminal,
    accentGradient: 'from-[#56369C]/12 via-[#56369C]/4 to-transparent',
    github: 'https://github.com/titsoujs',
    email: 'charlie@vaultscope.de',
  },
];

export const Team = () => {
  const { locale, localePath } = useLanguage();
  const isDe = locale === 'de';

  useEffect(() => {
    document.title = 'Team — VaultScope';
  }, []);

  return (
    <div className="bg-[var(--bg)] text-[var(--fg)]">

      {/* Hero */}
      <section className="relative pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        <div className="vs-container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-display-xl tracking-tight text-[var(--fg)] mb-4">
              {isDe
                ? 'Die Menschen hinter VaultScope.'
                : 'Meet the people behind VaultScope.'}
            </h1>
            <p className="text-body-l text-[var(--fg-muted)] max-w-[62ch]">
              {isDe
                ? 'Wir sind ein unabhängiges Team aus Entwicklern und Administratoren. Wir bauen unsere Software selbst, betreiben unsere eigene Hardware in Deutschland und helfen Ihnen bei Fragen direkt weiter.'
                : 'We are an independent team of developers and systems engineers. We build our own software, run our own hardware in Germany, and support our users directly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Team Profiles Grid */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {TEAM_MEMBERS.map((member) => {
              const Icon = member.icon;
              const role = isDe ? member.roleDe : member.roleEn;
              const bio = isDe ? member.bioDe : member.bioEn;
              const focus = isDe ? member.focusDe : member.focusEn;

              return (
                <article
                  key={member.name}
                  className="flex flex-col justify-between gap-6"
                >
                  {/* Profile Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-[6px] bg-[var(--bg-subtle)] flex items-center justify-center">
                          <span className="font-mono text-sm font-bold text-[var(--accent-bright)]">
                            {member.initials}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-[var(--fg)] tracking-tight leading-snug">
                            {member.name}
                          </h2>
                          <p className="text-xs font-mono text-[var(--fg-subtle)]">
                            {member.handle}
                          </p>
                        </div>
                      </div>
                      <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    </div>

                    <p className="text-xs font-mono uppercase tracking-[0.06em] text-[var(--accent-bright)]">
                      {role}
                    </p>

                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                      {bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {focus.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-[4px] bg-[var(--bg-subtle)] text-[11px] font-mono text-[var(--fg-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Links */}
                  <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                      >
                        <span>GitHub ({member.handle})</span>
                        <ArrowUpRight className="w-3 h-3 text-[var(--accent-bright)]" />
                      </a>
                      {member.website && member.websiteLabel && (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                        >
                          <Globe className="w-3 h-3 text-[var(--accent-bright)]" />
                          <span>{member.websiteLabel}</span>
                        </a>
                      )}
                    </div>

                    <a
                      href={`mailto:${member.email}`}
                      title={member.email}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent-bright)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{member.email}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Contact Callout */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-display-m text-[var(--fg)] mb-2">
                {isDe ? 'Direkter Kontakt ohne Umwege' : 'Talk directly to the team'}
              </h2>
              <p className="text-body-m text-[var(--fg-muted)]">
                {isDe
                  ? 'Bei uns landen Ihre Fragen nicht bei einem Chatbot, sondern direkt bei den Entwicklern.'
                  : 'When you reach out to VaultScope, you speak directly with the engineers who build and run the platform.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={localePath('/company/contact/')} className="vs-btn-primary">
                <span>{isDe ? 'Nachricht senden' : 'Contact Us'}</span>
              </Link>
              <a href="mailto:info@vaultscope.de" className="vs-btn-secondary font-mono text-xs">
                info@vaultscope.de
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
