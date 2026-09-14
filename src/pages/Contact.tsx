import { useEffect } from 'react';
import { PageHero, Breadcrumbs } from '../components/Shared';
import { WaitlistForm } from '../components/WaitlistForm';
import { LifeBuoy, GitBranch, Activity, BookOpen, FileText, Shield, CreditCard, Handshake, Info } from 'lucide-react';
import { useLanguage } from '../i18n';

export const Contact = () => {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t.contact.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.contactPage.metaDescription);
    }
  }, [t]);

  const contactLinks = [
    { email: 'support@vaultscope.de', label: 'Technical Support', icon: LifeBuoy, desc: 'For help with your instances and services.' },
    { email: 'billing@vaultscope.de', label: 'Billing & Sales', icon: CreditCard, desc: 'For invoice and payment inquiries.' },
    { email: 'data@vaultscope.de', label: 'Data & Privacy', icon: Shield, desc: 'For GDPR and data removal requests.' },
    { email: 'dmca@vaultscope.de', label: 'Abuse & DMCA', icon: Shield, desc: 'To report abuse or copyright infringement.' },
    { email: 'opensource@vaultscope.de', label: 'Open Source', icon: GitBranch, desc: 'For open-source project collaboration.' },
    { email: 'partner@vaultscope.de', label: 'Partnerships', icon: Handshake, desc: 'For business inquiries and partnerships.' },
    { email: 'pegasus@vaultscope.de', label: 'Pegasus Bot', icon: Info, desc: 'For inquiries regarding Pegasus.' }
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 lg:px-12 pt-32">
        <Breadcrumbs items={[{ label: t.contactPage.breadcrumbs.company }, { label: t.contactPage.breadcrumbs.contact }]} />
      </div>
      <PageHero
        eyebrow={t.contactPage.eyebrow}
        title={t.contactPage.heroTitle}
        description={t.contactPage.heroDescription}
        align="left"
      />

      {/* Contact channels */}
      <section className="py-20 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border max-w-6xl">
            {contactLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.email} className={`p-8 border-border flex flex-col gap-4 ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < contactLinks.length - (contactLinks.length % 3 || 3) ? 'border-b' : ''}`}>
                  <div className="w-10 h-10 border border-border flex items-center justify-center">
                    <Icon className="w-4 h-4 text-foreground/50" />
                  </div>
                  <div>
                    <p className="text-xl font-medium text-foreground tracking-tight mb-2">{item.label}</p>
                    <p className="text-sm text-foreground/50 font-light leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
                    >
                      {item.email}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border border-t-0 max-w-6xl mt-8">
            {[
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
                href: 'https://pegasusbot.app/docs',
                external: true,
              },
              {
                icon: FileText,
                label: t.contactPage.links.imprint.label,
                desc: t.contactPage.links.imprint.desc,
                href: '/legal/imprint/',
                external: false,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const cls = `p-6 flex flex-col gap-3 border-r border-border last:border-r-0 hover:bg-foreground/[0.01] transition-colors ${i >= 2 ? 'border-t border-border' : ''} md:border-t-0`;
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
      <section className="py-20 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium tracking-tighter text-foreground mb-4">
              {t.contactPage.waitlist.title}
            </h2>
            <p className="text-foreground/50 font-light mb-10 leading-relaxed">
              {t.contactPage.waitlist.description}
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

    </div>
  );
};
