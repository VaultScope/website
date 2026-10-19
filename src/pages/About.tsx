import { PageHero, Button } from '../components/Shared';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { SeoHead } from '../components/SeoHead';

export const About = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text)]">
      <SeoHead
        title="About VaultScope — Independent Cloud & Software Engineering"
        description="Learn about VaultScope's mission: delivering transparent, high-performance infrastructure and open-source software engineered in Germany."
        path="/company/about"
      />

      <PageHero
        breadcrumbs={[
          { label: t.aboutPage.breadcrumbs.company },
          { label: t.aboutPage.breadcrumbs.about },
        ]}
        eyebrow={t.aboutPage.principlesEyebrow}
        title={t.aboutPage.heroTitle}
        description={t.aboutPage.heroDescription}
        align="left"
      />

      {/* Editorial Narrative */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-bright)] mb-2">
                01 / Identity
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] mb-3">
                {t.aboutPage.whatIsTitle}
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t.aboutPage.whatIsDescription}
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-bright)] mb-2">
                02 / Platform Stack
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] mb-3">
                {t.aboutPage.whatWeBuildTitle}
              </h2>
              <div className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
                <p>
                  <strong className="text-[var(--text)] font-medium">
                    {t.about.whatWeBuild.infrastructure.title}
                  </strong>{' '}
                  — {t.aboutPage.whatWeBuildInfrastructure}
                </p>
                <p>
                  <strong className="text-[var(--text)] font-medium">
                    {t.about.whatWeBuild.deploy.title}
                  </strong>{' '}
                  — {t.aboutPage.whatWeBuildDeploy}
                </p>
                <p>
                  <strong className="text-[var(--text)] font-medium">
                    {t.about.whatWeBuild.software.title}
                  </strong>{' '}
                  — {t.aboutPage.whatWeBuildSoftware}
                </p>
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-bright)] mb-2">
                03 / Purpose
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] mb-3">
                {t.aboutPage.whyWeExistTitle}
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t.aboutPage.whyWeExistDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles — Scannable 2-Column Grid */}
      <section className="py-12 lg:py-16">
        <div className="vs-container">
          <div className="mb-10 max-w-2xl">
            <p className="text-eyebrow mb-2">{t.aboutPage.principlesEyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[var(--text)]">
              {t.aboutPage.principlesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {t.aboutPage.principles.map((item, i) => (
              <div key={i}>
                <span className="block font-mono text-xs font-semibold text-[var(--accent-bright)] mb-2">
                  0{i + 1}
                </span>
                <h3 className="text-base font-semibold text-[var(--text)] tracking-tight mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16">
        <div className="vs-container flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)] mb-1">
              Direct Engineering & Infrastructure Inquiries
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Questions about our infrastructure architecture, open-source software, or custom deployments?
            </p>
          </div>
          <LocaleLink to="/company/contact/">
            <Button>{t.about.cta}</Button>
          </LocaleLink>
        </div>
      </section>
    </div>
  );
};
export default About;
