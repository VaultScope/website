import { PageHero } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import {
  LifeBuoy,
  GitBranch,
  Activity,
  BookOpen,
  FileText,
  Shield,
  CreditCard,
  Handshake,
  Info,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';

export const Contact = () => {
  const { t } = useLanguage();

  const contactLinks = [
    {
      email: 'support@vaultscope.de',
      label: 'Technical Support',
      icon: LifeBuoy,
      desc: 'For help with your instances and services.',
    },
    {
      email: 'billing@vaultscope.de',
      label: 'Billing & Sales',
      icon: CreditCard,
      desc: 'For invoice and payment inquiries.',
    },
    {
      email: 'data@vaultscope.de',
      label: 'Data & Privacy',
      icon: Shield,
      desc: 'For GDPR and data removal requests.',
    },
    {
      email: 'dmca@vaultscope.de',
      label: 'Abuse & DMCA',
      icon: Shield,
      desc: 'To report abuse or copyright infringement.',
    },
    {
      email: 'opensource@vaultscope.de',
      label: 'Open Source',
      icon: GitBranch,
      desc: 'For open-source project collaboration.',
    },
    {
      email: 'partner@vaultscope.de',
      label: 'Partnerships',
      icon: Handshake,
      desc: 'For business inquiries and partnerships.',
    },
    {
      email: 'pegasus@vaultscope.de',
      label: 'Pegasus Bot',
      icon: Info,
      desc: 'For inquiries regarding Pegasus.',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <SeoHead
        title="Contact & Enterprise Support"
        description="Get in touch with the VaultScope engineering team for enterprise deployments, custom setups, or technical support."
        path="/company/contact"
      />

      <PageHero
        breadcrumbs={[
          { label: t.contactPage.breadcrumbs.company, href: '/company/about/' },
          { label: t.contactPage.breadcrumbs.contact },
        ]}
        title={t.contactPage.heroTitle}
        description={t.contactPage.heroDescription}
        align="left"
      />

      {/* Contact Channels */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            {contactLinks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.email}
                  className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  <div className="md:col-span-4 flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                    <p className="text-sm font-semibold text-[var(--text)] tracking-tight">
                      {item.label}
                    </p>
                  </div>
                  <p className="md:col-span-5 text-xs text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="md:col-span-3 md:text-right">
                    <a
                      href={`mailto:${item.email}`}
                      className="font-mono text-xs font-medium text-[var(--accent-bright)] hover:text-[var(--text)] transition-colors break-all"
                    >
                      {item.email}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary Resources */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                icon: MessageSquare,
                label: 'Discord Community',
                desc: 'Talk with developers about features & UI/UX (no customer support).',
                href: 'https://discord.gg/84kMAY2aKm',
                external: true,
              },
              {
                icon: Activity,
                label: t.contactPage.links.serviceStatus.label,
                desc: t.contactPage.links.serviceStatus.desc,
                href: 'https://status.vaultscope.de/status/vs',
                external: true,
              },
              {
                icon: GitBranch,
                label: t.contactPage.links.github.label,
                desc: t.contactPage.links.github.desc,
                href: 'https://github.com/semi-constructor',
                external: true,
              },
              {
                icon: BookOpen,
                label: t.contactPage.links.documentation.label,
                desc: t.contactPage.links.documentation.desc,
                href: '/docs',
                external: false,
              },
              {
                icon: FileText,
                label: t.contactPage.links.imprint.label,
                desc: t.contactPage.links.imprint.desc,
                href: '/legal/imprint/',
                external: false,
              },
            ].map((item) => {
              const Icon = item.icon;
              const cls = 'group flex flex-col gap-2.5 transition-colors';
              const content = (
                <>
                  <Icon className="w-4 h-4 text-[var(--accent-bright)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-bright)] transition-colors tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </>
              );
              return item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cls}
                >
                  {content}
                </a>
              ) : (
                <LocaleLink key={item.label} to={item.href} className={cls}>
                  {content}
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-eyebrow mb-2">Availability & Updates</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] mb-3">
                {t.contactPage.waitlist.title}
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t.contactPage.waitlist.description}
              </p>
            </div>
            <div className="lg:col-span-7">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
