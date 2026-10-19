import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe, Mail, Code2, Server, Terminal } from 'lucide-react';
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
  website: string;
  websiteLabel: string;
  email: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Toowake',
    handle: '@Toowake',
    initials: 'TW',
    roleEn: 'Co-Founder & Lead Developer',
    roleDe: 'Mitgründer & Lead Developer',
    bioEn:
      'Leads software development across VaultScope — building the Pegasus platform, the VAMOS backend, and the customer dashboard.',
    bioDe:
      'Leitet die Softwareentwicklung bei VaultScope — entwickelt die Pegasus-Plattform, das VAMOS-Backend und das Kunden-Dashboard.',
    focusEn: ['Software Architecture', 'Pegasus', 'VAMOS & Storefront'],
    focusDe: ['Software-Architektur', 'Pegasus', 'VAMOS & Storefront'],
    icon: Code2,
    accentGradient: 'from-[#56369C]/14 via-[#56369C]/5 to-transparent',
    github: 'https://github.com/Toowake',
    website: 'https://toowake.dev',
    websiteLabel: 'toowake.dev',
    email: 'toowake@vaultscope.de',
  },
  {
    name: 'Nyxan.zip',
    handle: '@Nyxanzip',
    initials: 'NX',
    roleEn: 'Co-Founder & Infrastructure Lead',
    roleDe: 'Mitgründer & Infrastructure Lead',
    bioEn:
      'Designs and operates VaultScope’s physical servers, Linux systems, networking, and encrypted SFTP storage infrastructure.',
    bioDe:
      'Plant und betreibt die physischen Server, Linux-Systeme, Netzwerke und die verschlüsselte SFTP-Speicherinfrastruktur von VaultScope.',
    focusEn: ['Server Hardware', 'Linux & Storage', 'Network Security'],
    focusDe: ['Server-Hardware', 'Linux & Speicher', 'Netzwerksicherheit'],
    icon: Server,
    accentGradient: 'from-[#4B328A]/14 via-[#56369C]/5 to-transparent',
    github: 'https://github.com/Nyxanzip',
    website: 'https://nyxan.xyz',
    websiteLabel: 'nyxan.xyz',
    email: 'nyxan@vaultscope.de',
  },
  {
    name: 'Benniboy',
    handle: '@benniboy0609',
    initials: 'BB',
    roleEn: 'Developer',
    roleDe: 'Entwickler',
    bioEn:
      'Builds platform features, internal tools, and integrations across VaultScope’s web applications and services.',
    bioDe:
      'Entwickelt Plattform-Funktionen, interne Werkzeuge und Integrationen für die Web-Anwendungen und Dienste von VaultScope.',
    focusEn: ['Web Applications', 'Platform Tooling', 'Integrations'],
    focusDe: ['Web-Anwendungen', 'Plattform-Tools', 'Integrationen'],
    icon: Terminal,
    accentGradient: 'from-[#5E3CA8]/12 via-[#56369C]/4 to-transparent',
    github: 'https://github.com/benniboy0609',
    website: 'https://benni.vaultscope.de',
    websiteLabel: 'benni.vaultscope.de',
    email: 'benni@vaultscope.de',
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
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
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3 h-3 text-[var(--accent-bright)]" />
                      </a>
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                      >
                        <Globe className="w-3 h-3 text-[var(--accent-bright)]" />
                        <span>{member.websiteLabel}</span>
                      </a>
                    </div>

                    <a
                      href={`mailto:${member.email}`}
                      title={member.email}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--accent-bright)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="sr-only sm:not-sr-only">{member.email}</span>
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
