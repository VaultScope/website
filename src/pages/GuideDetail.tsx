import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { LocaleLink, useLanguage } from '../i18n';
import { SeoHead } from '../components/SeoHead';
import { findStaticGuide, SEO_GUIDES } from '../data/seoGuides';
import { api } from '../lib/api';
import type { BlogArticle } from './BlogDetail';

export function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLanguage();
  const isDe = locale === 'de';

  const staticGuide = slug ? findStaticGuide(slug) : undefined;
  const [dynamicArticle, setDynamicArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(!staticGuide);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (staticGuide || !slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    api
      .get<BlogArticle>(`/storefront/blog/${encodeURIComponent(slug)}`)
      .then((res) => setDynamicArticle(res))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug, staticGuide]);

  const dynamicHtml = useMemo(() => {
    if (!dynamicArticle?.content) return '';
    const rawHtml = marked.parse(dynamicArticle.content) as string;
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/(?![/\\]))/i,
      FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'iframe', 'object', 'embed', 'svg', 'math'],
      FORBID_ATTR: ['style', 'srcdoc', 'formaction'],
    });
  }, [dynamicArticle?.content]);

  if (staticGuide) {
    const content = isDe ? staticGuide.de : staticGuide.en;
    const guidePath = isDe ? `/de/guides/${staticGuide.slug}` : `/guides/${staticGuide.slug}`;
    const related = SEO_GUIDES.filter((g) => g.slug !== staticGuide.slug).slice(0, 2);

    return (
      <>
        <SeoHead
          title={content.title}
          description={content.description}
          path={guidePath}
          type="article"
          publishedTime={staticGuide.publishedAt}
          author="VaultScope Engineering"
          jsonLd={[
            {
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              headline: content.title,
              description: content.description,
              datePublished: staticGuide.publishedAt,
              author: {
                '@type': 'Organization',
                name: 'VaultScope',
                url: 'https://vaultscope.de',
              },
              publisher: {
                '@type': 'Organization',
                name: 'VaultScope',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://vaultscope.de/logos/logo-picture.png',
                },
              },
              mainEntityOfPage: `https://vaultscope.de${guidePath}`,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'VaultScope', item: 'https://vaultscope.de/' },
                { '@type': 'ListItem', position: 2, name: isDe ? 'Guides' : 'Guides', item: `https://vaultscope.de${isDe ? '/de/guides' : '/guides'}` },
                { '@type': 'ListItem', position: 3, name: content.title, item: `https://vaultscope.de${guidePath}` },
              ],
            },
          ]}
        />

        <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
          <div className="vs-container max-w-4xl">
            <div className="mb-8">
              <LocaleLink
                to="/guides"
                className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isDe ? 'Alle technischen Guides' : 'All technical guides'}</span>
              </LocaleLink>
            </div>

            <article className="space-y-10">
              <header className="space-y-4 border-b border-[var(--line)] pb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-faint)]">
                  <span className="text-[var(--accent-bright)]">{content.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {content.readingTimeMin} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {staticGuide.publishedAt}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[var(--text)] leading-tight">
                  {content.title}
                </h1>
                <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                  {content.excerpt}
                </p>
              </header>

              <div className="space-y-10">
                {content.sections.map((sec) => (
                  <section key={sec.heading} className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">
                      {sec.heading}
                    </h2>
                    {sec.paragraphs.map((p, idx) => (
                      <p key={idx} className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="space-y-2 pt-1 text-sm text-[var(--text-muted)]">
                        {sec.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bright)] mt-2 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    {isDe ? 'Bereit für den produktiven Einsatz?' : 'Ready to deploy on VaultScope?'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {isDe
                      ? 'Transparente Infrastruktur mit EU-Datenhaltung und direktem Support.'
                      : 'Transparent European infrastructure with GDPR compliance and direct engineering support.'}
                  </p>
                </div>
                <LocaleLink
                  to={content.ctaHref}
                  className="vs-btn-primary inline-flex items-center gap-2 shrink-0"
                >
                  <span>{content.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </LocaleLink>
              </div>

              {related.length > 0 && (
                <div className="pt-4 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
                    {isDe ? 'Weitere Guides' : 'Related Guides'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map((r) => {
                      const rc = isDe ? r.de : r.en;
                      return (
                        <LocaleLink
                          key={r.slug}
                          to={`/guides/${r.slug}`}
                          className="rounded-lg border border-[var(--line)] p-4 hover:border-[var(--accent-bright)] transition-colors block space-y-1.5"
                        >
                          <span className="text-[11px] font-mono text-[var(--accent-bright)]">
                            {rc.category}
                          </span>
                          <div className="text-sm font-semibold text-[var(--text)]">{rc.title}</div>
                        </LocaleLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container py-20 text-center font-mono text-xs text-[var(--text-muted)]">
          {isDe ? 'Guide wird geladen...' : 'Loading guide...'}
        </div>
      </div>
    );
  }

  if (error || !dynamicArticle) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container py-20 text-center space-y-4">
          <BookOpen className="w-6 h-6 text-[var(--text-faint)] mx-auto" />
          <h1 className="text-xl font-semibold text-[var(--text)]">
            {isDe ? 'Guide nicht gefunden.' : 'Guide not found.'}
          </h1>
          <LocaleLink
            to="/guides"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-xs font-mono hover:border-[var(--accent-bright)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isDe ? 'Zur Guide-Übersicht' : 'Back to guides'}</span>
          </LocaleLink>
        </div>
      </div>
    );
  }

  const dynPath = isDe ? `/de/guides/${dynamicArticle.slug}` : `/guides/${dynamicArticle.slug}`;
  return (
    <>
      <SeoHead
        title={dynamicArticle.title}
        description={
          dynamicArticle.excerpt ||
          dynamicArticle.content.substring(0, 160).replace(/[#*`\n]/g, ' ')
        }
        path={dynPath}
        type="article"
        publishedTime={dynamicArticle.published_at}
        author={dynamicArticle.author?.name || dynamicArticle.author_name || 'VaultScope Team'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: dynamicArticle.title,
          datePublished: dynamicArticle.published_at,
          mainEntityOfPage: `https://vaultscope.de${dynPath}`,
        }}
      />
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container max-w-4xl space-y-8">
          <LocaleLink
            to="/guides"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isDe ? 'Alle technischen Guides' : 'All technical guides'}</span>
          </LocaleLink>

          <article className="space-y-8">
            <header className="space-y-3 border-b border-[var(--line)] pb-6">
              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[var(--text)]">
                {dynamicArticle.title}
              </h1>
              {dynamicArticle.excerpt && (
                <p className="text-base text-[var(--text-muted)] leading-relaxed">
                  {dynamicArticle.excerpt}
                </p>
              )}
            </header>
            <div
              className="markdown-preview max-w-none text-[var(--text-muted)] leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: dynamicHtml }}
            />
          </article>
        </div>
      </div>
    </>
  );
}
