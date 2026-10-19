import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Handshake,
  ArrowRight,
  ArrowUpRight,
  Film,
  Shield,
  Sliders,
  Volume2,
  Share2,
  Code2,
} from 'lucide-react';
import { useLanguage } from '../i18n';
import { Breadcrumbs } from '../components/Shared';
import { SeoHead } from '../components/SeoHead';
import { api } from '../lib/api';

export const Partners = () => {
  const { locale, localePath } = useLanguage();
  const isDe = locale === 'de';
  const [liveCampaigns, setLiveCampaigns] = useState<
    Array<{ slug: string; name: string; headline?: string | null; badge_text?: string | null }>
  >([]);

  useEffect(() => {
    let active = true;
    api
      .get<any[]>('/storefront/partners')
      .then((res) => {
        if (active && Array.isArray(res)) {
          setLiveCampaigns(res);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const fthrHighlights = [
    {
      icon: Shield,
      title: isDe ? 'Privatsphäre an erster Stelle' : 'Privacy First — Local by Default',
      desc: isDe
        ? 'Keine Telemetrie, kein Account-Zwang und keine Hintergrund-Internetverbindungen. Alle Aufnahmen, Schnitte und Einstellungen bleiben lokal auf Ihrem System.'
        : 'Zero telemetry, no required account, and no background internet connections. Every clip, edit, and setting stays strictly on your machine.',
    },
    {
      icon: Film,
      title: isDe ? 'Hardwarebeschleunigte Aufnahme' : 'Hardware-Accelerated Replay Buffer',
      desc: isDe
        ? 'Kontinuierlicher Replay-Buffer mit bis zu 240 FPS und moderner Hardware-Codierung (H.264, HEVC, AV1) bei minimaler Systemlast unter Windows 10/11 und Linux (Wayland).'
        : 'Rolling replay buffer up to 240 FPS with hardware encoding (H.264, HEVC, AV1) and negligible performance impact across Windows 10/11 and Linux (Wayland).',
    },
    {
      icon: Sliders,
      title: isDe ? 'Integrierter Echtzeit-Editor' : 'Built-In Real-Time Video Editor',
      desc: isDe
        ? 'Direktes Trimmen, Zuschneiden, Teilen, Geschwindigkeitsanpassungen und Overlays mit flüssiger Timeline-Vorschau ohne Wartezeiten.'
        : 'Instant timeline scrubbing, trimming, cropping, splitting, playback speed control, and overlays without waiting for background re-renders.',
    },
    {
      icon: Volume2,
      title: isDe ? 'Multiband-Audiospuren' : 'Multiband Audio Separation',
      desc: isDe
        ? 'Separate Tonspuren für Spielsound, Mikrofon, Sprachchat und Desktop-Apps – nachträglich im Editor einzeln regelbar oder stummschaltbar.'
        : 'Independent audio tracks for game audio, microphone, voice chat, and desktop apps—mix or mute any track individually in post.',
    },
    {
      icon: Share2,
      title: isDe ? 'Direktes Teilen & Komprimierung' : 'Frictionless Sharing & Compression',
      desc: isDe
        ? 'Direktes Drag-and-Drop der Videodateien, automatische Größenkomprimierung (z. B. für Discord) oder optionale Upload-Integrationen.'
        : 'Drag-and-drop raw files directly into any app, compress to target file sizes for Discord, or configure optional uploaders when you choose.',
    },
    {
      icon: Code2,
      title: isDe ? '100 % Open Source' : '100% Open-Source Software',
      desc: isDe
        ? 'Vollständig quelloffen auf GitHub entwickelt – ohne versteckte Monetarisierung, Werbung oder künstliche Funktionssperren.'
        : 'Developed openly on GitHub with full source transparency—free of ads, paywalls, or dark-pattern monetization.',
    },
  ];

  return (
    <div className="bg-[var(--bg)] text-[var(--fg)]">
      <SeoHead
        title={isDe ? 'Partner — VaultScope' : 'Partners — VaultScope'}
        description={
          isDe
            ? 'Offizielle Partner von VaultScope — FTHR Clips (fthrclips.com).'
            : 'Official partners of VaultScope — FTHR Clips (fthrclips.com).'
        }
        path="/company/partners/"
      />

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="vs-container">
          <Breadcrumbs
            items={[
              { label: isDe ? 'Unternehmen' : 'Company', href: '/company/about/' },
              { label: isDe ? 'Partner' : 'Partners' },
            ]}
          />

          <div className="max-w-3xl">
            <h1 className="text-display-xl text-[var(--fg)] mb-5">
              {isDe ? 'Unsere Partner.' : 'Our Partners.'}
            </h1>
            <p className="text-body-l text-[var(--fg-muted)] max-w-[60ch] mb-6">
              {isDe
                ? 'Wir arbeiten gezielt mit ausgewählten Projekten zusammen, die unsere Werte für Open-Source-Transparenz, Datenschutz und kompromisslose Software-Qualität teilen.'
                : 'We partner selectively with projects that share our commitment to open-source transparency, user privacy, and uncompromising software engineering.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://fthrclips.com"
                target="_blank"
                rel="noreferrer"
                className="vs-btn-primary"
              >
                <span>{isDe ? 'FTHR Clips besuchen' : 'Visit FTHRClips.com'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link to={localePath('/company/contact/')} className="vs-btn-secondary">
                <span>{isDe ? 'Partnerschaft anfragen' : 'Inquire About Partnership'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PARTNER: FTHR CLIPS ─── */}
      <section className="vs-section">
        <div className="vs-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--accent-bright)] mb-3">
                <Handshake className="w-4 h-4" />
                <span>{isDe ? 'Offizieller Partner' : 'Official Partner'}</span>
              </div>

              <h2 className="text-display-l text-[var(--fg)] mb-4">FTHR Clips</h2>

              <p className="text-lg font-medium text-[var(--fg)] mb-4">
                {isDe
                  ? '„Clip any game or app, without sacrificing your privacy.“'
                  : '“Clip any game or app, without sacrificing your privacy.”'}
              </p>

              <p className="text-body-m text-[var(--fg-muted)] leading-relaxed mb-6">
                {isDe
                  ? 'FTHR Clips ist eine quelloffene Desktop-Anwendung zum Aufnehmen, Schneiden und Teilen von Spielen und Anwendungen für Windows und Linux. Anders als herkömmliche Clipping-Programme verzichtet FTHR Clips vollständig auf Kontozwang, Telemetrie, Werbung und Cloud-Zwang – Ihre Privatsphäre ist keine Währung.'
                  : "FTHR Clips is an open-source desktop application for capturing, editing, and sharing games and apps on Windows and Linux. Unlike mainstream clipping tools, FTHR Clips operates with zero telemetry, no required accounts, and no background internet connections—because your privacy isn't currency."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://fthrclips.com"
                  target="_blank"
                  rel="noreferrer"
                  className="vs-btn-primary"
                >
                  <span>FTHRClips.com</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/FTHR-Community/FTHR-Clips"
                  target="_blank"
                  rel="noreferrer"
                  className="vs-btn-secondary"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="https://discord.gg/fthrclips"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors px-2 py-2"
                >
                  <span>Discord Community</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6 pt-2">
              <div>
                <div className="font-mono text-xs text-[var(--accent-bright)] mb-1">
                  {isDe ? 'Plattformen' : 'Platforms'}
                </div>
                <div className="text-base font-semibold text-[var(--fg)] mb-1">
                  Windows 10/11 & Linux
                </div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {isDe ? 'Nativ für Windows & Linux (Wayland)' : 'Native Windows & Linux (Wayland) support'}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-[var(--accent-bright)] mb-1">
                  {isDe ? 'Encoder' : 'Encoding'}
                </div>
                <div className="text-base font-semibold text-[var(--fg)] mb-1">
                  H.264 · HEVC · AV1
                </div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {isDe ? 'Bis zu 240 FPS Hardware-Encoding' : 'Up to 240 FPS hardware encoding'}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-[var(--accent-bright)] mb-1">
                  {isDe ? 'Datenschutz' : 'Privacy Model'}
                </div>
                <div className="text-base font-semibold text-[var(--fg)] mb-1">
                  {isDe ? '100 % Lokal & Offline' : '100% Local & Offline'}
                </div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {isDe ? 'Keine Telemetrie · Kein Account nötig' : 'Zero telemetry · No account required'}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-[var(--accent-bright)] mb-1">
                  {isDe ? 'Lizenz & Quellcode' : 'License & Source'}
                </div>
                <div className="text-base font-semibold text-[var(--fg)] mb-1">
                  Open Source
                </div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  {isDe ? 'FTHR-Community auf GitHub' : 'FTHR-Community on GitHub'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {fthrHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    <h3 className="text-base font-semibold text-[var(--fg)] tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LIVE PARTNER CAMPAIGNS (WHEN CONFIGURED VIA VAMOS) ─── */}
      {liveCampaigns.length > 0 && (
        <section className="vs-section">
          <div className="vs-container">
            <div className="max-w-2xl mb-8">
              <h2 className="text-display-m text-[var(--fg)] mb-2">
                {isDe ? 'Aktive Partner-Aktionen' : 'Active Partner Campaigns'}
              </h2>
              <p className="text-body-m text-[var(--fg-muted)]">
                {isDe
                  ? 'Exklusive Testkontingente für Mitglieder unserer Partner-Communities.'
                  : 'Exclusive trial allocations for members of our partner communities.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {liveCampaigns.map((camp) => (
                <Link
                  key={camp.slug}
                  to={localePath(`/ps/${camp.slug}`)}
                  className="flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs text-[var(--accent-bright)]">
                        {camp.badge_text || 'PARTNER'}
                      </span>
                      <Handshake className="w-4 h-4 text-[var(--accent-bright)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-2">{camp.name}</h3>
                    {camp.headline && (
                      <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
                        {camp.headline}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-bright)] group-hover:text-[var(--fg)] transition-colors">
                    <span>{isDe ? 'Aktion ansehen' : 'View Campaign'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BECOME A PARTNER CTA ─── */}
      <section className="vs-section">
        <div className="vs-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h2 className="text-display-m text-[var(--fg)] mb-3">
                {isDe ? 'Partner von VaultScope werden' : 'Become a VaultScope Partner'}
              </h2>
              <p className="text-body-m text-[var(--fg-muted)] max-w-[58ch]">
                {isDe
                  ? 'Betreiben Sie ein Open-Source-Projekt oder eine Entwickler-Community? Wir unterstützen Partner mit gesponserten Infrastruktur-Kontingenten und gemeinsamen Aktionen.'
                  : 'Running an open-source project or developer community? We support partners with sponsored infrastructure allocations and custom community trial links.'}
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link to={localePath('/company/contact/')} className="vs-btn-primary">
                <span>{isDe ? 'Partnerschaft anfragen' : 'Inquire About Partnership'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
