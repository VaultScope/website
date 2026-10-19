import { useState } from 'react';
import { PageHero, Button, RuledTable } from '../components/Shared';
import {
  Shield,
  Zap,
  TrendingUp,
  Gift,
  Volume2,
  Tag,
  Star,
  Code,
  Database,
  ArrowRight,
  GitBranch,
  Globe,
  BarChart3,
  Lock,
  Settings,
  Users,
} from 'lucide-react';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';

const MODULES = [
  {
    icon: Shield,
    title: 'Advanced Moderation',
    description: 'Complete staff toolkit with automated enforcement and persistent audit trails.',
    features: [
      'AutoMod V2: keyword, regex, mention-spam, and attachment-spam rules',
      'Warning engine with threshold automations and ban/timeout escalation',
      'Quarantine Vault that isolates suspicious accounts until staff review',
    ],
  },
  {
    icon: BarChart3,
    title: 'Full Economy System',
    description: 'Server-wide currency with daily rewards, a customizable shop, and games.',
    features: [
      'Daily and work rewards with streak bonuses and cooldowns',
      'Fully customizable shop with role grants and XP boosters',
      'Dice, coinflip, slots, blackjack, and roulette modules',
    ],
  },
  {
    icon: TrendingUp,
    title: 'XP & Engagement',
    description: 'Track activity with visual rank cards, role rewards, and a prestige system.',
    features: [
      'Text and voice XP with configurable per-channel multipliers',
      'Visual rank cards with custom colour and aesthetic settings',
      'Prestige system, daily quests, achievements, and reputation',
    ],
  },
  {
    icon: Settings,
    title: 'Ticket System',
    description: 'Multi-panel ticketing with per-department routing and staff action tooling.',
    features: [
      'Multi-panel setup with custom titles, buttons, and welcome messages',
      'Staff claim, close, lock, and freeze actions from Discord or the dashboard',
      'Web-based ticket transcripts accessible outside of Discord',
    ],
  },
  {
    icon: Gift,
    title: 'Giveaway System',
    description: 'Host advanced giveaways with configurable requirements and instant rerolls.',
    features: [
      'Multi-winner selection with custom embed images and thumbnails',
      'Entry requirements: required role, minimum XP, minimum account age',
      'Bonus entry multipliers, immediate end, and winner reroll support',
    ],
  },
  {
    icon: Volume2,
    title: 'Join-to-Create Voice',
    description: 'Let members instantly spawn and manage private voice channels on demand.',
    features: [
      'Automatic channel creation when a user joins the master base channel',
      'Interactive management panel: lock/unlock, set user limit',
      'Automatic cleanup when the last user leaves',
    ],
  },
  {
    icon: Tag,
    title: 'Role Management',
    description: 'Flexible role assignment through reactions, automation, and persistence.',
    features: [
      'Reaction roles with full custom emoji support',
      'Sticky roles that persist when members leave and rejoin',
      'Auto-role on join and time-limited temporary roles',
    ],
  },
  {
    icon: Star,
    title: 'Social & Feeds',
    description: 'Keep communities connected with content feeds and birthday automation.',
    features: [
      'YouTube and RSS feed integrations that post to Discord channels',
      'Automatic member birthday announcements with custom messages',
      'Peer-to-peer reputation and thanks system',
    ],
  },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/health', desc: 'Server liveness, cache stats, and aggregator status', auth: 'Public' },
  { method: 'GET', path: '/stats', desc: 'Aggregated bot performance and feature metrics', auth: 'Bearer' },
  { method: 'GET', path: '/status', desc: 'Hardware, OS, CPU, memory, disk, and network snapshot', auth: 'Bearer' },
  { method: 'GET', path: '/dashboard/overview', desc: 'Bot-wide KPIs, top guilds, and recent activity feed', auth: 'Bearer' },
  { method: 'GET', path: '/monitoring/health', desc: 'Database pool, cache, rate limiter, and aggregator state', auth: 'Bearer' },
  { method: 'GET', path: '/monitoring/metrics', desc: 'Historical cache hit rates and database query profiling', auth: 'Bearer' },
  { method: 'GET', path: '/guilds/:guildId/economy', desc: 'Economy leaderboard, shop items, and configuration', auth: 'Bearer' },
  { method: 'POST', path: '/guilds/:guildId/giveaways', desc: 'Create and start a new giveaway with full configuration', auth: 'Bearer' },
];

type DeployMethod = 'docker' | 'pm2' | 'pterodactyl' | 'coolify';

const DEPLOY_STEPS: Record<DeployMethod, { title: string; cmd: string }[]> = {
  docker: [
    { title: 'Clone the repository', cmd: 'git clone https://github.com/semi-constructor/pegasus.git\ncd pegasus' },
    { title: 'Configure environment', cmd: 'cp .env.example .env\nnano .env' },
    { title: 'Start with Docker Compose', cmd: 'docker compose up -d' },
    { title: 'Check status and view logs', cmd: 'docker compose ps\ndocker compose logs -f' },
  ],
  pm2: [
    { title: 'Clone and install', cmd: 'git clone https://github.com/semi-constructor/pegasus.git\ncd pegasus && npm install' },
    { title: 'Configure environment', cmd: 'cp .env.example .env && nano .env' },
    { title: 'Build and start', cmd: 'npm run build\npm2 start npm --name pegasus -- start' },
    { title: 'Enable auto-startup', cmd: 'pm2 startup\npm2 save' },
  ],
  pterodactyl: [
    { title: 'Download the Pegasus egg', cmd: '# github.com/semi-constructor/pegasus\n# /blob/main/deploy/pterodactyl/egg.json' },
    { title: 'Import egg in Pterodactyl', cmd: '# Nests → Import Egg → Select egg.json' },
    { title: 'Create server with the Pegasus egg', cmd: '# Fill env variables via the Pterodactyl panel' },
    { title: 'Configure rate limits in Variables', cmd: '# Set RATE_LIMIT_WINDOW and RATE_LIMIT_MAX_REQUESTS\n# Disable "Users Can Edit" for both' },
  ],
  coolify: [
    { title: 'Create a project in Coolify', cmd: '# + New → Public Repository' },
    { title: 'Add the Pegasus repository', cmd: 'https://github.com/semi-constructor/pegasus' },
    { title: 'Set build configuration', cmd: '# Branch: main | Build Pack: Nixpacks\n# Base Directory: / | Port: 2000' },
    { title: 'Add environment variables & deploy', cmd: '# Copy .env.example contents → fill in values\n# Click Deploy' },
  ],
};

const DEPLOY_LABELS: Record<DeployMethod, string> = {
  docker: 'Docker',
  pm2: 'PM2',
  pterodactyl: 'Pterodactyl',
  coolify: 'Coolify',
};

export const Pegasus = () => {
  const [activeDeployment, setActiveDeployment] = useState<DeployMethod>('docker');

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <SeoHead
        title="Pegasus — Discord Community Management Platform"
        description="Full-featured Discord community management platform built by VaultScope with eight modular subsystems, a Next.js web dashboard, and a complete REST API."
        path="/software/pegasus"
      />

      <PageHero
        breadcrumbs={[{ label: 'Software', href: '/projects/' }, { label: 'Pegasus' }]}
        title="Powerful Discord automation without giving up control."
        description="Pegasus is a full-featured Discord community management platform engineered for transparency and self-hosting. Eight modular subsystems, a Next.js web dashboard, and an authenticated Express REST API."
        primaryCta="Open Dashboard"
        primaryLink="https://pegasusbot.app/dashboard"
        secondaryCta="View on GitHub"
        secondaryLink="https://github.com/semi-constructor/pegasus"
      />

      {/* Platform Modules — Open Architectural Grid */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-10 max-w-2xl">
            <p className="text-eyebrow mb-2">Subsystem Architecture</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2.5">
              Eight modular subsystems.
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Enable only the modules your community requires. Every subsystem is configurable at the guild level via slash commands or the web control plane.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.title} className="flex flex-col">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    <h3 className="text-base font-semibold text-[var(--text)] tracking-tight">{mod.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{mod.description}</p>
                  <ul className="space-y-1.5 pl-3 border-l border-[var(--line)]">
                    {mod.features.map((f, fi) => (
                      <li key={fi} className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture & Web Dashboard */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6">
              <p className="text-eyebrow mb-2">Web Interface</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2.5">
                Next.js management dashboard.
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                The Pegasus Dashboard connects directly to the bot over its Bearer-authenticated REST API. Manage guild configurations, inspect moderation logs, and publish read-only leaderboards from the browser.
              </p>

              <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
                {[
                  {
                    label: 'Guild Telemetry',
                    desc: 'Live guild statistics, database query profiling, cache hit ratios, and process health pulled from the bot API.',
                  },
                  {
                    label: 'Module Configuration',
                    desc: 'Toggle and configure AutoMod rules, economy parameters, ticket panels, XP multipliers, and voice channels.',
                  },
                  {
                    label: 'Public Leaderboards',
                    desc: 'Enable shareable, read-only web leaderboards for XP, economy balances, and active giveaways.',
                  },
                  {
                    label: 'Discord OAuth2',
                    desc: 'Sign in via Discord OAuth2 through NextAuth with role-gated guild administration and developer ID controls.',
                  },
                ].map((item) => (
                  <div key={item.label} className="py-4">
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{item.label}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <p className="text-eyebrow mb-2">Technical Stack</p>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2.5">
                Runtime & persistence specifications.
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                Pegasus separates the Discord event runtime, the HTTP API layer, and the Next.js web interface so each component can be deployed and scaled independently.
              </p>

              <div className="border-t border-b border-[var(--line)]">
                <RuledTable>
                  <thead>
                    <tr>
                      <th className="pl-0">Subsystem</th>
                      <th className="pr-0">Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Bot Runtime', value: 'Node.js · TypeScript · discord.js v14' },
                      { label: 'Web Dashboard', value: 'Next.js 16 (App Router) · Tailwind CSS v4' },
                      { label: 'Database & ORM', value: 'PostgreSQL · Drizzle ORM (Parameterized SQL)' },
                      { label: 'Authentication', value: 'NextAuth · Discord OAuth2 · Bearer API Token' },
                      { label: 'Bot HTTP API', value: 'Express REST API (Port 2000) · In-Memory TTL Cache' },
                      { label: 'License', value: 'PolyForm Noncommercial License 1.0.0' },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="pl-0 font-medium text-[var(--text)] w-48">{row.label}</td>
                        <td className="pr-0 font-mono text-xs text-[var(--text-muted)]">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </RuledTable>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://pegasusbot.app/dashboard" target="_blank" rel="noreferrer">
                  <Button size="sm">Open Dashboard</Button>
                </a>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">Dashboard Repository</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REST API Reference & System Architecture */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <p className="text-eyebrow mb-2">REST Interface</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)]">
                Built-in Express HTTP API on port 2000.
              </h2>
            </div>
            <a
              href="https://github.com/semi-constructor/pegasus-dashboard/blob/main/API_DOC.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent-bright)] hover:text-[var(--text)] transition-colors"
            >
              Full API Documentation <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="border-t border-b border-[var(--line)]">
            <RuledTable>
              <thead>
                <tr>
                  <th className="pl-0">Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                  <th className="pr-0">Auth</th>
                </tr>
              </thead>
              <tbody>
                {API_ENDPOINTS.map((ep) => (
                  <tr key={ep.path}>
                    <td className="pl-0 font-mono text-xs font-semibold text-[var(--accent-bright)] w-24">{ep.method}</td>
                    <td className="font-mono text-xs text-[var(--text)]">{ep.path}</td>
                    <td className="text-xs text-[var(--text-muted)]">{ep.desc}</td>
                    <td className="pr-0 font-mono text-xs text-[var(--text-faint)] w-24">{ep.auth}</td>
                  </tr>
                ))}
              </tbody>
            </RuledTable>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-10 lg:gap-12">
            {[
              {
                label: 'Clients',
                icon: Users,
                items: [
                  { name: 'Discord Members', desc: 'Interact via slash commands, buttons, and reactions inside Discord.' },
                  { name: 'Administrators', desc: 'Manage guilds through the Next.js web dashboard with Discord OAuth2.' },
                  { name: 'Developers', desc: 'Access data and trigger actions via the Bearer-authenticated REST API.' },
                ],
              },
              {
                label: 'Pegasus Core',
                icon: Zap,
                items: [
                  { name: 'Discord Bot', desc: 'discord.js v14 bot handling all Discord events and slash commands.' },
                  { name: 'Express REST API', desc: 'HTTP API on port 2000 with rate limiting, bearer auth, and caching.' },
                  { name: 'Cache Layer', desc: 'In-memory cache with configurable TTL and cache hit telemetry.' },
                ],
              },
              {
                label: 'Security & Storage',
                icon: Database,
                items: [
                  { name: 'Zod Input Validation', desc: 'All user and API input validated with strict Zod schemas at runtime.' },
                  { name: 'Encrypted Storage', desc: 'Sensitive guild credentials encrypted at rest using a 32-byte key.' },
                  { name: 'Multi-Tier Rate Limits', desc: 'Global IP limits, stats throttling, and per-guild write rate limits.' },
                ],
              },
            ].map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.label}>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--line)]">
                    <span className="text-sm font-semibold text-[var(--text)]">{col.label}</span>
                    <Icon className="w-4 h-4 text-[var(--accent-bright)]" />
                  </div>
                  <div className="space-y-4">
                    {col.items.map((item) => (
                      <div key={item.name}>
                        <div className="text-sm font-semibold text-[var(--text)] mb-1">{item.name}</div>
                        <div className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--line)] grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Lock, label: 'Zod Schema Validation', desc: 'Runtime payload validation across all API routes.' },
              { icon: Shield, label: 'Developer-Gated Admin', desc: 'System commands restricted to explicit DEVELOPER_IDS.' },
              { icon: Code, label: 'Bearer Token Auth', desc: 'All non-health REST endpoints require Bearer authentication.' },
              { icon: Globe, label: 'Localised Responses', desc: 'Built-in localisation for English, Deutsch, Español, and Français.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                    <span className="text-xs font-semibold text-[var(--text)]">{item.label}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Self-Hosting & Deployment Options — Open Layout */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-8 max-w-2xl">
            <p className="text-eyebrow mb-2">Self-Hosting & Managed Options</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-2">
              Deploy Pegasus on your own infrastructure.
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Pegasus source code is available for permitted noncommercial self-hosting via Docker Compose, PM2, Pterodactyl, or Coolify.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex border-b border-[var(--line)] overflow-x-auto gap-6">
              {(Object.keys(DEPLOY_LABELS) as DeployMethod[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveDeployment(key)}
                  className={`py-2.5 text-xs font-medium border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer ${
                    activeDeployment === key
                      ? 'border-[var(--accent-bright)] text-[var(--text)] font-semibold'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {DEPLOY_LABELS[key]}
                </button>
              ))}
            </div>

            <div className="divide-y divide-[var(--line)] border-b border-[var(--line)]">
              {DEPLOY_STEPS[activeDeployment].map((step, si) => (
                <div key={si} className="flex flex-col md:flex-row gap-4 md:items-center py-4">
                  <div className="md:w-64 shrink-0">
                    <span className="font-mono text-xs text-[var(--accent-bright)] mr-2">0{si + 1}</span>
                    <span className="text-sm font-medium text-[var(--text)]">{step.title}</span>
                  </div>
                  <pre className="flex-1 bg-[var(--bg-subtle)] rounded-[4px] px-4 py-2.5 font-mono text-xs text-[var(--text-muted)] overflow-x-auto">
                    {step.cmd}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-[var(--text)] mb-2">Run it yourself</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5 flex-1">
                Deploy Pegasus on your own server using Docker, PM2, Pterodactyl, or Coolify. Full source access under the PolyForm Noncommercial license.
              </p>
              <div>
                <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <GitBranch className="w-3.5 h-3.5 mr-2" />
                    View Repository
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-[var(--text)] mb-2">Pegasus Cloud</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5 flex-1">
                A managed Pegasus deployment operated by VaultScope with automated updates, database backups, and infrastructure support.
              </p>
              <div>
                <LocaleLink to="/company/contact/">
                  <Button size="sm">Get in Touch</Button>
                </LocaleLink>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-[var(--text)] mb-2">Custom Deployment</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5 flex-1">
                Dedicated single-tenant deployments, custom module development, and bespoke Discord infrastructure integrations.
              </p>
              <div>
                <LocaleLink to="/company/contact/">
                  <Button variant="outline" size="sm">Contact Engineering</Button>
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Pegasus;
