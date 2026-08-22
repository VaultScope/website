import { useState, useEffect } from 'react';
import { PageHero, FeatureSection, Button, Breadcrumbs } from '../components/Shared';
import {
  Shield, Zap, TrendingUp, Gift, Volume2, Tag, Star,
  Code, Database, Server, ArrowRight,
  GitBranch, Globe, BarChart3, Lock, Settings, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    n: '01',
    icon: Shield,
    tag: 'Moderation',
    title: 'Advanced Moderation',
    description: 'Complete staff toolkit with automated enforcement and persistent audit trails.',
    features: [
      'AutoMod V2: keyword, regex, mention-spam, and attachment-spam rules',
      'Warning engine with threshold automations and ban/timeout escalation',
      'Quarantine Vault that isolates suspicious accounts until staff review',
    ],
  },
  {
    n: '02',
    icon: BarChart3,
    tag: 'Economy',
    title: 'Full Economy System',
    description: 'Server-wide currency with daily rewards, a customizable shop, and gambling.',
    features: [
      'Daily and work rewards with streak bonuses and cooldowns',
      'Fully customizable shop with role grants and XP boosters',
      'Dice, coinflip, slots, blackjack, and roulette gambling',
    ],
  },
  {
    n: '03',
    icon: TrendingUp,
    tag: 'XP & Leveling',
    title: 'XP & Engagement',
    description: 'Track activity with visual rank cards, role rewards, and a prestige system.',
    features: [
      'Text and voice XP with configurable per-channel multipliers',
      'Visual rank cards with custom colour and aesthetic settings',
      'Prestige system, daily quests, achievements, and reputation',
    ],
  },
  {
    n: '04',
    icon: Settings,
    tag: 'Tickets',
    title: 'Ticket System',
    description: 'Multi-panel ticketing with per-department routing and staff action tooling.',
    features: [
      'Multi-panel setup with custom titles, buttons, and welcome messages',
      'Staff claim, close, lock, and freeze actions from Discord or the dashboard',
      'Web-based ticket transcripts accessible outside of Discord',
    ],
  },
  {
    n: '05',
    icon: Gift,
    tag: 'Giveaways',
    title: 'Giveaway System',
    description: 'Host advanced giveaways with configurable requirements and instant rerolls.',
    features: [
      'Multi-winner selection with custom embed images and thumbnails',
      'Entry requirements: required role, minimum XP, minimum account age',
      'Bonus entry multipliers, immediate end, and winner reroll support',
    ],
  },
  {
    n: '06',
    icon: Volume2,
    tag: 'Voice',
    title: 'Join-to-Create',
    description: 'Let members instantly spawn and manage private voice channels on demand.',
    features: [
      'Automatic channel creation when a user joins the master base channel',
      'Interactive management panel: lock/unlock, set user limit',
      'Automatic cleanup when the last user leaves',
    ],
  },
  {
    n: '07',
    icon: Tag,
    tag: 'Roles',
    title: 'Role Management',
    description: 'Flexible role assignment through reactions, automation, and persistence.',
    features: [
      'Reaction roles with full custom emoji support',
      'Sticky roles that persist when members leave and rejoin',
      'Auto-role on join and time-limited temporary roles',
    ],
  },
  {
    n: '08',
    icon: Star,
    tag: 'Social',
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
  { method: 'GET',  path: '/health',                    desc: 'Server liveness, cache stats, and aggregator status',        auth: false },
  { method: 'GET',  path: '/stats',                     desc: 'Aggregated real-time bot performance and feature metrics',    auth: true  },
  { method: 'GET',  path: '/status',                    desc: 'Hardware, OS, CPU, memory, GPU, disk, and network snapshot',  auth: true  },
  { method: 'GET',  path: '/dashboard/overview',        desc: 'Bot-wide KPIs, top guilds, and recent activity feed',        auth: true  },
  { method: 'GET',  path: '/monitoring/health',         desc: 'Database pool, cache, rate limiter, and aggregator state',   auth: true  },
  { method: 'GET',  path: '/monitoring/metrics',        desc: 'Historical cache hit rates and database query profiling',    auth: true  },
  { method: 'GET',  path: '/guilds/:guildId/economy',   desc: 'Economy leaderboard, shop items, and configuration',        auth: true  },
  { method: 'POST', path: '/guilds/:guildId/giveaways', desc: 'Create and start a new giveaway with full configuration',   auth: true  },
];

type DeployMethod = 'docker' | 'pm2' | 'pterodactyl' | 'coolify';

const DEPLOY_STEPS: Record<DeployMethod, { title: string; cmd: string }[]> = {
  docker: [
    { title: 'Clone the repository',       cmd: 'git clone https://github.com/semi-constructor/pegasus.git\ncd pegasus' },
    { title: 'Configure environment',      cmd: 'cp .env.example .env\nnano .env' },
    { title: 'Start with Docker Compose',  cmd: 'docker compose up -d' },
    { title: 'Check status and view logs', cmd: 'docker compose ps\ndocker compose logs -f' },
  ],
  pm2: [
    { title: 'Clone and install',          cmd: 'git clone https://github.com/semi-constructor/pegasus.git\ncd pegasus && npm install' },
    { title: 'Configure environment',      cmd: 'cp .env.example .env && nano .env' },
    { title: 'Build and start',            cmd: 'npm run build\npm2 start npm --name pegasus -- start' },
    { title: 'Enable auto-startup',        cmd: 'pm2 startup\npm2 save' },
  ],
  pterodactyl: [
    { title: 'Download the Pegasus egg',         cmd: '# github.com/semi-constructor/pegasus\n# /blob/main/deploy/pterodactyl/egg.json' },
    { title: 'Import egg in Pterodactyl',         cmd: '# Nests → Import Egg → Select egg.json' },
    { title: 'Create server with the Pegasus egg', cmd: '# Fill env variables via the Pterodactyl panel' },
    { title: 'Configure rate limits in Variables', cmd: '# Set RATE_LIMIT_WINDOW and RATE_LIMIT_MAX_REQUESTS\n# Disable "Users Can Edit" for both' },
  ],
  coolify: [
    { title: 'Create a project in Coolify',     cmd: '# + New → Public Repository' },
    { title: 'Add the Pegasus repository',       cmd: 'https://github.com/semi-constructor/pegasus' },
    { title: 'Set build configuration',          cmd: '# Branch: main | Build Pack: Nixpacks\n# Base Directory: / | Port: 2000' },
    { title: 'Add environment variables & deploy', cmd: '# Copy .env.example contents → fill in values\n# Click Deploy' },
  ],
};

const DEPLOY_LABELS: Record<DeployMethod, string> = {
  docker:       'Docker',
  pm2:          'PM2',
  pterodactyl:  'Pterodactyl',
  coolify:      'Coolify',
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const Pegasus = () => {
  const [activeDeployment, setActiveDeployment] = useState<DeployMethod>('docker');

  useEffect(() => {
    document.title = "Pegasus — VaultScope Software";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Pegasus is a full-featured Discord community management platform with advanced moderation, economy, XP, tickets, giveaways, and a complete web dashboard and REST API."
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Software' }, { label: 'Pegasus' }]} />
      </div>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="VAULTSCOPE SOFTWARE"
        title="Powerful Discord automation. Without giving up control."
        description="Pegasus is a full-featured Discord community management platform built for flexibility, transparency, and self-hosting. Eight production-ready modules. A complete web dashboard. A full REST API."
        primaryCta="Open Dashboard"
        primaryLink="https://pegasusbot.app/dashboard"
        secondaryCta="View on GitHub"
        secondaryLink="https://github.com/semi-constructor/pegasus"
      />

      {/* ─── PLATFORM MODULES GRID ────────────────────────────────── */}
      <section className="relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 pt-24 pb-16">
          <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-4">Platform Modules</div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            Everything your community needs.
          </h2>
          <p className="text-xl text-foreground/50 font-light max-w-2xl">
            Eight production-ready modules. Enable what you need, disable what you don't. Every module is configurable at the guild level.
          </p>
        </div>

        <div className="border-t border-border">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 border-l border-b border-border">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.n}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="px-8 py-10 border-r border-t border-border bg-background hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">
                      {mod.n}&nbsp;// {mod.tag}
                    </span>
                    <Icon className="w-4 h-4 text-foreground/25 shrink-0" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground tracking-tight mb-3">{mod.title}</h3>
                  <p className="text-sm text-foreground/50 font-light leading-relaxed mb-6">{mod.description}</p>
                  <ul className="flex flex-col gap-3">
                    {mod.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-foreground/40 font-light leading-snug">
                        <span className="shrink-0 w-px h-3 bg-foreground/20 block mt-1" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURE DEEP DIVES ───────────────────────────────────── */}

      {/* Moderation */}
      <FeatureSection
        index={0}
        title="Moderation that scales with your community."
        description="AutoMod V2 catches rule violations before staff ever need to act. Warning automations handle escalation automatically. The Quarantine Vault isolates suspicious accounts until your team reviews them."
        features={[
          { title: "AutoMod V2", desc: "Keyword, regex, mention-spam, and attachment-spam triggers with configurable actions including delete, warn, timeout, and infraction points." },
          { title: "Warning Engine", desc: "Structured warnings with title, description, level, and proof. Automation rules automatically escalate to timeout or ban when thresholds are reached." },
          { title: "Quarantine Vault", desc: "Automatically isolates suspicious accounts by stripping roles until a staff member reviews and releases them." },
        ]}
        visual={
          <div className="border border-border bg-background w-full overflow-hidden">
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Moderation Log</span>
              <span className="text-xs text-foreground/20 font-mono">live</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { type: 'WARN',  user: 'User#4821', reason: 'Spam trigger — #general',       time: '2m ago',  level: 1 },
                { type: 'BAN',   user: 'User#0093', reason: 'Reached warning threshold (3)', time: '14m ago', level: 3 },
                { type: 'MUTE',  user: 'User#7712', reason: 'Mention spam — 12 mentions',    time: '31m ago', level: 2 },
                { type: 'WARN',  user: 'User#3345', reason: 'Word filter — severity: high',  time: '1h ago',  level: 1 },
              ].map((ev, i) => (
                <div key={i} className="px-5 py-4 flex items-start gap-4">
                  <span className={`text-xs font-mono font-medium w-10 shrink-0 pt-0.5 ${ev.type === 'BAN' ? 'text-foreground/60' : ev.type === 'MUTE' ? 'text-foreground/50' : 'text-foreground/35'}`}>
                    {ev.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{ev.user}</div>
                    <div className="text-xs text-foreground/40 font-light mt-0.5 truncate">{ev.reason}</div>
                  </div>
                  <span className="text-xs text-foreground/20 font-light shrink-0">{ev.time}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-5 py-3 grid grid-cols-3 gap-4">
              {[
                { label: 'Cases (30d)',  value: '312' },
                { label: 'Active Mutes', value: '3'   },
                { label: 'Quarantined', value: '1'    },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xs text-foreground/25 uppercase tracking-widest mb-0.5">{s.label}</div>
                  <div className="text-lg font-medium text-foreground">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Economy + XP */}
      <FeatureSection
        index={1}
        reverse={true}
        title="Economy and leveling built for engagement."
        description="A complete server-wide economy with customizable rewards, a shop, gambling, and a full XP leveling system. Visual rank cards, role rewards, prestige, quests — all configurable per guild."
        features={[
          { title: "Economy System", desc: "Daily and work rewards with streak bonuses. Custom server shop with role grants and XP boosters. Dice, coinflip, slots, blackjack, and roulette." },
          { title: "XP & Leveling", desc: "Text and voice XP with per-channel multipliers. Fully customizable visual rank cards. Configurable role rewards at level milestones." },
          { title: "Prestige & Quests", desc: "Members reset at max level to gain a prestige rank. Daily quests, achievements, and a peer-to-peer reputation system keep engagement high." },
        ]}
        visual={
          <div className="border border-border bg-background w-full overflow-hidden">
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">XP Leaderboard</span>
              <span className="text-xs text-foreground/20 font-mono">#general-server</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { rank: '01', user: 'User#8821', xp: '89,412',  level: 64 },
                { rank: '02', user: 'User#3341', xp: '72,105',  level: 58 },
                { rank: '03', user: 'User#9910', xp: '63,882',  level: 52 },
                { rank: '04', user: 'User#1234', xp: '51,240',  level: 46 },
              ].map((row) => (
                <div key={row.rank} className="px-5 py-4 flex items-center gap-4">
                  <span className="text-xs text-foreground/20 font-mono w-6 shrink-0">{row.rank}</span>
                  <span className="text-sm font-medium text-foreground flex-1">{row.user}</span>
                  <span className="text-xs font-mono text-foreground/40">{row.xp} xp</span>
                  <span className="text-xs font-medium text-foreground/30 w-14 text-right shrink-0">Lv.&nbsp;{row.level}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-5 py-4 grid grid-cols-2 gap-4">
              <div className="border border-border p-4">
                <div className="text-xs text-foreground/25 uppercase tracking-widest mb-1">Economy</div>
                <div className="text-sm font-medium text-foreground mb-1">1,420 active accounts</div>
                <div className="text-xs text-foreground/40">12.4M coins in circulation</div>
              </div>
              <div className="border border-border p-4">
                <div className="text-xs text-foreground/25 uppercase tracking-widest mb-1">Shop</div>
                <div className="text-sm font-medium text-foreground mb-1">12 items listed</div>
                <div className="text-xs text-foreground/40">Role grants · Boosters</div>
              </div>
            </div>
          </div>
        }
      />

      {/* Tickets */}
      <FeatureSection
        index={2}
        title="Tickets with real staff tooling."
        description="Multi-panel ticket setups with custom departments, routing, and per-panel staff roles. Staff members can claim, close, lock, or freeze tickets directly from Discord or the web dashboard."
        features={[
          { title: "Multi-Department Panels", desc: "Create multiple ticket panels with custom titles, descriptions, button styles, and welcome messages. Route each panel to a different department and category." },
          { title: "Staff Actions", desc: "Claim, close, lock, and freeze actions available via Discord buttons and the web dashboard. Full audit trail of all ticket events." },
          { title: "Web Transcripts", desc: "Ticket conversations are stored and accessible as persistent web pages, independently of Discord." },
        ]}
        visual={
          <div className="border border-border bg-background w-full overflow-hidden">
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Ticket System</span>
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">4 Open</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { id: '#0152', user: 'User#4411', dept: 'General Support',    status: 'OPEN',    age: '8m'  },
                { id: '#0151', user: 'User#8823', dept: 'Technical Support',  status: 'CLAIMED', age: '22m' },
                { id: '#0150', user: 'User#2299', dept: 'General Support',    status: 'OPEN',    age: '1h'  },
                { id: '#0149', user: 'User#6670', dept: 'Bug Reports',        status: 'LOCKED',  age: '2h'  },
              ].map((t) => (
                <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                  <span className="text-xs font-mono text-foreground/30 w-12 shrink-0">{t.id}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{t.user}</div>
                    <div className="text-xs text-foreground/40 truncate">{t.dept}</div>
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-widest shrink-0 ${t.status === 'CLAIMED' ? 'text-foreground/50' : t.status === 'LOCKED' ? 'text-foreground/25' : 'text-foreground/40'}`}>
                    {t.status}
                  </span>
                  <span className="text-xs text-foreground/20 w-6 text-right shrink-0">{t.age}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-5 py-3 grid grid-cols-3 gap-4">
              {[
                { label: 'Total',       value: '152' },
                { label: 'Avg Response', value: '12m' },
                { label: 'Panels',      value: '2'   },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xs text-foreground/25 uppercase tracking-widest mb-0.5">{s.label}</div>
                  <div className="text-lg font-medium text-foreground">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* ─── WEB DASHBOARD ────────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
            <div>
              <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">04 // Dashboard</div>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9]">
                A full management interface.
              </h2>
              <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-xl mb-12">
                The Pegasus Dashboard is a production Next.js web application that connects directly to Pegasus over its REST API. Manage every module, view analytics, and configure your servers — all from the browser.
              </p>
              <div className="flex flex-col gap-8">
                {[
                  { label: "Real-Time Analytics", desc: "Live guild analytics, database query profiling, cache hit rates, and hardware health — pulled directly from the bot's Express API." },
                  { label: "Module Management", desc: "Configure and toggle every Pegasus module on the fly: AutoMod, economy, tickets, XP, giveaways, JTC, and more." },
                  { label: "Public Leaderboards", desc: "Enable shareable, read-only leaderboards for XP, economy, and giveaways directly from the dashboard." },
                  { label: "Discord OAuth2", desc: "Secure sign-in via Discord OAuth2 through NextAuth. Assign developer admin access to specific Discord user IDs." },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-2 border-l border-foreground/10 pl-6">
                    <h3 className="text-base font-medium text-foreground tracking-normal uppercase">{item.label}</h3>
                    <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-foreground/[0.02] p-8">
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-8">Dashboard Tech Stack</div>
              <div className="grid grid-cols-2 gap-0 border-l border-t border-border">
                {[
                  { label: "Framework",    value: "Next.js 16 (App Router)" },
                  { label: "Language",     value: "TypeScript" },
                  { label: "Styling",      value: "TailwindCSS v4" },
                  { label: "ORM",          value: "Drizzle ORM" },
                  { label: "Database",     value: "Neon PostgreSQL" },
                  { label: "Auth",         value: "NextAuth + Discord OAuth2" },
                  { label: "Bot API",      value: "Express + Bearer Token" },
                  { label: "Deployment",   value: "Vercel / Cloudflare" },
                ].map((row) => (
                  <div key={row.label} className="border-r border-b border-border px-5 py-4">
                    <div className="text-xs text-foreground/30 uppercase tracking-widest mb-1">{row.label}</div>
                    <div className="text-sm font-medium text-foreground">{row.value}</div>
                  </div>
                ))}
              </div>
              <div className="pt-8 mt-8 border-t border-border flex flex-col sm:flex-row gap-4">
                <a href="https://pegasusbot.app/dashboard" target="_blank" rel="noreferrer" className="flex-1">
                  <Button className="w-full h-10 px-6 text-xs">Open Dashboard</Button>
                </a>
                <a href="https://github.com/semi-constructor/pegasus-dashboard" target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full h-10 px-6 text-xs">Dashboard Repo</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REST API ─────────────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">

            <div className="lg:order-2">
              <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">05 // API</div>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9]">
                A complete REST API.
              </h2>
              <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-xl mb-12">
                Pegasus ships a built-in Express REST API on port&nbsp;2000. Every resource is available over HTTP with Bearer token authentication, multi-tier rate limiting, and an in-memory caching layer.
              </p>
              <div className="flex flex-col gap-6">
                {[
                  { label: "Bearer Token Auth",    desc: "All routes except GET /health require an Authorization: Bearer <token> header." },
                  { label: "Multi-Tier Rate Limits", desc: "Global IP limit (200 req/min), stats endpoints (2 req/500ms), and per-guild write endpoints (10 req/s)." },
                  { label: "In-Memory Caching",    desc: "Read endpoints are cached with TTL headers. Cache state, hit rate, and memory usage are all exposed via API." },
                  { label: "Structured Errors",    desc: "All errors return a consistent JSON payload with code, message, and Zod validation details where applicable." },
                ].map((item) => (
                   <div key={item.label} className="flex flex-col gap-2 border-l border-foreground/10 pl-6">
                    <h3 className="text-base font-medium text-foreground tracking-normal uppercase">{item.label}</h3>
                    <p className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:order-1">
              <div className="border border-border bg-background overflow-hidden">
                <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">API Endpoints</span>
                  <span className="text-xs text-foreground/30 font-mono">port :2000</span>
                </div>
                <div className="divide-y divide-border">
                  {API_ENDPOINTS.map((ep) => (
                    <div key={ep.path} className="px-6 py-4 hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex items-start gap-4">
                        <span className={`text-xs font-mono font-medium w-10 shrink-0 pt-0.5 ${ep.method === 'POST' ? 'text-foreground/60' : 'text-foreground/40'}`}>
                          {ep.method}
                        </span>
                        <div className="flex-1 min-w-0">
                          <code className="text-sm font-mono text-foreground break-all">{ep.path}</code>
                          <p className="text-xs text-foreground/40 font-light mt-1 leading-relaxed">{ep.desc}</p>
                        </div>
                        <span className={`text-xs font-medium uppercase tracking-widest shrink-0 ${ep.auth ? 'text-foreground/20' : 'text-foreground/50'}`}>
                          {ep.auth ? 'Auth' : 'Public'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-6 py-4">
                  <a
                    href="https://github.com/semi-constructor/pegasus-dashboard/blob/main/API_DOC.md"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-foreground/40 hover:text-foreground uppercase tracking-widest transition-colors group"
                  >
                    Full API Documentation
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE ─────────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">06 // Architecture</div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">How Pegasus is structured.</h2>
            <p className="text-xl text-foreground/50 font-light max-w-2xl">
              A Discord bot, a REST API, and a web dashboard — three components working together, all self-hostable.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 border border-border">
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
                  { name: 'Cache Layer', desc: 'In-memory cache with configurable TTL. Cache stats exposed via API.' },
                ],
              },
              {
                label: 'Infrastructure',
                icon: Database,
                items: [
                  { name: 'Neon PostgreSQL', desc: 'Serverless Postgres database via Drizzle ORM with parameterized queries.' },
                  { name: 'Encrypted Storage', desc: 'Sensitive data encrypted at rest using a configurable 32-char key.' },
                  { name: 'Sentry / Logging', desc: 'Optional Sentry DSN integration and Winston file/console logging.' },
                ],
              },
            ].map((col, ci) => {
              const Icon = col.icon;
              return (
                <div key={col.label} className={`p-8 ${ci < 2 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}`}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 border border-border flex items-center justify-center">
                      <Icon className="w-4 h-4 text-foreground/50" />
                    </div>
                    <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{col.label}</span>
                  </div>
                  <div className="flex flex-col gap-6">
                    {col.items.map((item) => (
                      <div key={item.name} className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                        <span className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border border-border p-8">
            <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Data Flow</div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 flex-wrap">
              {[
                'Discord Event',
                'Pegasus Bot',
                'REST API',
                'Web Dashboard',
              ].map((step, si, arr) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="border border-border px-4 py-2 text-xs font-medium text-foreground/60 uppercase tracking-widest whitespace-nowrap">
                    {step}
                  </div>
                  {si < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-foreground/20 shrink-0" />
                  )}
                </div>
              ))}
              <div className="sm:ml-8 flex items-center gap-4">
                <div className="h-px w-6 bg-border hidden sm:block" />
                <div className="border border-border px-4 py-2 text-xs font-medium text-foreground/60 uppercase tracking-widest whitespace-nowrap">
                  PostgreSQL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEPLOYMENT ───────────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">07 // Self-Hosting</div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">Deploy Pegasus yourself.</h2>
            <p className="text-xl text-foreground/50 font-light max-w-2xl">
              Pegasus source code is available and self-hostable for permitted noncommercial use. Choose the deployment method that fits your infrastructure.
            </p>
          </div>

          {/* Method tabs */}
          <div className="border border-border mb-0">
            <div className="flex border-b border-border overflow-x-auto">
              {(Object.keys(DEPLOY_LABELS) as DeployMethod[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveDeployment(key)}
                  className={`px-8 py-4 text-xs font-medium uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer border-r border-border last:border-r-0 ${
                    activeDeployment === key
                      ? 'bg-foreground text-background'
                      : 'text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03]'
                  }`}
                >
                  {DEPLOY_LABELS[key]}
                </button>
              ))}
            </div>

            <div className="p-0">
              {DEPLOY_STEPS[activeDeployment].map((step, si) => (
                <div
                  key={si}
                  className={`flex flex-col md:flex-row gap-6 p-8 ${si < DEPLOY_STEPS[activeDeployment].length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="shrink-0 flex items-start gap-4 md:w-48">
                    <span className="text-xs font-medium text-foreground/20 uppercase tracking-widest w-6 shrink-0 pt-0.5">
                      {String(si + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-foreground tracking-tight">{step.title}</span>
                  </div>
                  <div className="flex-1 bg-foreground/[0.03] border border-border px-5 py-4 font-mono text-xs text-foreground/60 whitespace-pre leading-relaxed overflow-x-auto">
                    {step.cmd}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer">
              <Button variant="outline" className="h-10 px-8 text-xs">
                <GitBranch className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </a>
            <a href="https://pegasusbot.app/docs/installation" target="_blank" rel="noreferrer">
              <Button variant="ghost" className="h-10 px-8 text-xs">
                Full Installation Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── SECURITY & RELIABILITY ───────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">08 // Security</div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6 leading-[0.95]">
                Built with security in mind.
              </h2>
              <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-xl">
                Pegasus applies security practices throughout: input validation, encrypted storage, rate limiting, and developer-gated admin commands.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-0 border border-border">
              {[
                { icon: Lock,      label: 'Input Validation',        desc: 'All user input validated with Zod schemas at runtime before processing.' },
                { icon: Database,  label: 'SQL Injection Prevention', desc: 'Drizzle ORM uses fully parameterized queries throughout.' },
                { icon: Zap,       label: 'Rate Limiting',            desc: 'Per-user command cooldowns plus global multi-tier API rate limiting.' },
                { icon: Shield,    label: 'Encrypted Storage',        desc: 'Sensitive data encrypted at rest using a configurable 32-character key.' },
                { icon: Code,      label: 'Bearer Token API',         desc: 'REST API protected by a configurable bearer token on all routes.' },
                { icon: Globe,     label: 'Developer-Gated Admin',    desc: 'Admin commands gated by DEVELOPER_IDS regardless of server permissions.' },
              ].map((item, ii) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`flex items-start gap-5 px-6 py-5 ${ii < 5 ? 'border-b border-border' : ''}`}>
                    <div className="w-8 h-8 border border-border shrink-0 flex items-center justify-center mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-foreground/40" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground tracking-tight mb-1">{item.label}</div>
                      <div className="text-sm text-foreground/40 font-light leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERNATIONALISATION ─────────────────────────────────── */}
      <section className="py-24 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-24">
            <div className="shrink-0">
              <Globe className="w-10 h-10 text-foreground/20 mb-4" />
              <h2 className="text-3xl font-medium tracking-tighter text-foreground mb-3">Built for international communities.</h2>
              <p className="text-foreground/50 font-light max-w-sm">
                Command descriptions and all bot responses are fully localised. Language can be set per-user or server-wide.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { code: 'en', name: 'English' },
                { code: 'de', name: 'Deutsch' },
                { code: 'es', name: 'Español' },
                { code: 'fr', name: 'Français' },
              ].map((lang) => (
                <div key={lang.code} className="border border-border px-5 py-3">
                  <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-1">{lang.code}</div>
                  <div className="text-sm font-medium text-foreground">{lang.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOSTING OPTIONS ──────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05] flex flex-col items-center px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9]">
              Run Pegasus your way.
            </h2>
            <p className="text-xl text-foreground/50 font-light">
              Choose what works best — run Pegasus on your own infrastructure or let VaultScope handle the operational side.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
            <div className="border border-border p-8 flex flex-col bg-background">
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Self-Hosted</div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Run it yourself</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1">
                Deploy Pegasus on your own infrastructure using Docker, PM2, Pterodactyl, or Coolify. You control the software, the data, and the hardware. Source-available under the PolyForm Noncommercial license.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-foreground/50 font-light">
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Full software access</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> PolyForm Noncommercial license</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Docker, PM2, Pterodactyl, Coolify</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Community documentation support</li>
              </ul>
              <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer" className="mt-auto">
                <Button variant="outline" className="w-full">Get Pegasus Free</Button>
              </a>
            </div>

            <div className="border border-foreground p-8 flex flex-col bg-foreground/[0.02]">
              <div className="text-xs font-medium text-foreground uppercase tracking-widest mb-6">Recommended · Coming Soon</div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Pegasus Cloud</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1">
                A managed Pegasus instance operated by VaultScope — without the operational overhead. Includes automatic updates, backups, monitoring, managed infrastructure, and support.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-foreground/50 font-light">
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Managed infrastructure</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Automatic updates and backups</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Monitoring and alerting</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> VaultScope support</li>
              </ul>
              <Link to="/pricing/" className="mt-auto">
                <Button className="w-full">View Pricing</Button>
              </Link>
            </div>

            <div className="border border-border p-8 flex flex-col bg-background md:col-span-2 lg:col-span-1">
              <div className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">Enterprise</div>
              <h3 className="text-2xl font-medium text-foreground tracking-tight mb-4">Custom Deployment</h3>
              <p className="text-foreground/50 font-light leading-relaxed mb-8 flex-1">
                For organizations with additional requirements. Dedicated deployments, custom configuration, integration work, and priority support.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-foreground/50 font-light">
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Dedicated deployments</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Custom configuration</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Integration and development work</li>
                <li className="flex items-center gap-2"><span className="text-foreground/30">—</span> Priority support</li>
              </ul>
              <Link to="/company/contact/" className="mt-auto">
                <Button variant="outline" className="w-full">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 relative bg-background border-t border-border/[0.05] flex flex-col items-center text-center px-6">
        <Server className="w-12 h-12 text-foreground/15 mb-8" />
        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 max-w-4xl leading-[0.9]">
          Add Pegasus to your community.
        </h2>
        <p className="text-xl text-foreground/50 font-light mb-12 max-w-2xl">
          Pegasus is a product developed and operated by VaultScope. Source-available and self-hostable for noncommercial use.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
          <a href="https://pegasusbot.app" target="_blank" rel="noreferrer">
            <Button>Visit pegasusbot.app</Button>
          </a>
          <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noreferrer">
            <Button variant="outline">
              <GitBranch className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
};
