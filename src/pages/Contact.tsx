import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { Mail, LifeBuoy, GitBranch, Activity, BookOpen, FileText } from 'lucide-react';
import { useLanguage } from '../i18n';

export const Contact = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.contact.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Get in touch with VaultScope. General enquiries, support, and launch notifications.');
    }
  }, [t]);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: 'Company' }, { label: 'Contact' }]} />
      </div>
      <PageHero
        eyebrow="CONTACT"
        title="Get in touch."
        description="General enquiries, support questions, or just want to know when hosting launches — here's how to reach us."
        align="left"
      />

      {/* Contact channels */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-0 border border-border max-w-4xl">

            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-border flex flex-col gap-5">
              <div className="w-10 h-10 border border-border flex items-center justify-center">
                <LifeBuoy className="w-4 h-4 text-foreground/50" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-2">Support</p>
                <p className="text-xl font-medium text-foreground tracking-tight mb-3">Customer Support</p>
                <p className="text-sm text-foreground/50 font-light leading-relaxed mb-5">
                  For questions about your hosting account, billing, or technical issues with
                  VaultScope services.
                </p>
                <a
                  href="mailto:support@vaultscope.de"
                  className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
                >
                  support@vaultscope.de
                </a>
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col gap-5 bg-foreground/[0.015]">
              <div className="w-10 h-10 border border-border flex items-center justify-center">
                <Mail className="w-4 h-4 text-foreground/50" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-2">General</p>
                <p className="text-xl font-medium text-foreground tracking-tight mb-3">General Enquiries</p>
                <p className="text-sm text-foreground/50 font-light leading-relaxed mb-5">
                  Business enquiries, partnerships, press, or anything else not covered by
                  the support channel.
                </p>
                <a
                  href="mailto:cptcr@proton.me"
                  className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
                >
                  cptcr@proton.me
                </a>
              </div>
            </div>

          </div>

          {/* Secondary links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border border-t-0 max-w-4xl">
            {[
              {
                icon: Activity,
                label: 'Service Status',
                desc: 'Live infrastructure uptime',
                href: 'https://status.vaultscope.de/status/vs',
                external: true,
              },
              {
                icon: GitBranch,
                label: 'GitHub',
                desc: 'Open-source repositories',
                href: 'https://github.com/semi-constructor',
                external: true,
              },
              {
                icon: BookOpen,
                label: 'Documentation',
                desc: 'Guides and references',
                href: 'https://pegasusbot.app/docs',
                external: true,
              },
              {
                icon: FileText,
                label: 'Imprint',
                desc: 'Legal contact details',
                href: '/legal/imprint/',
                external: false,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const cls = `p-6 flex flex-col gap-3 border-r border-border last:border-r-0 hover:bg-foreground/[0.01] transition-colors ${i >= 2 ? 'border-t border-border' : ''}`;
              const content = (
                <>
                  <Icon className="w-4 h-4 text-foreground/30" />
                  <div>
                    <p className="text-sm font-medium text-foreground tracking-tight">{item.label}</p>
                    <p className="text-xs text-foreground/40 font-light mt-0.5">{item.desc}</p>
                  </div>
                </>
              );
              return item.external
                ? <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={cls}>{content}</a>
                : <a key={item.label} href={item.href} className={cls}>{content}</a>;
            })}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium tracking-tighter text-foreground mb-4">
              Interested in hosting?
            </h2>
            <p className="text-foreground/50 font-light mb-10 leading-relaxed">
              Cloud VPS and Dedicated Servers are in preparation. Leave your email and we'll
              reach out when services are ready to launch.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

    </div>
  );
};
