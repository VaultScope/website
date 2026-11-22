import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { LocaleLink, useLanguage } from '../i18n';
import { SeoHead } from '../components/SeoHead';
import { SEO_GUIDES } from '../data/seoGuides';
import { api } from '../lib/api';
import type { BlogPost } from './BlogList';

export function GuidesIndex() {
  const { locale } = useLanguage();
  const isDe = locale === 'de';
  const [unlistedPosts, setUnlistedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api
      .get<BlogPost[]>('/storefront/blog')
      .then((data) => {
        if (!Array.isArray(data)) return;
        const guidesOnly = data.filter(
          (p) =>
            p.visibility === 'unlisted' ||
            p.visibility === 'guide' ||
            p.is_unlisted === true ||
            p.seo_only === true,
        );
        setUnlistedPosts(guidesOnly);
      })
      .catch(() => {});
  }, []);

  const title = isDe
    ? 'Technische Infrastruktur-Guides — VaultScope'
    : 'Technical Infrastructure Guides — VaultScope';

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <SeoHead
        title={isDe ? 'Technische Infrastruktur-Guides' : 'Technical Infrastructure Guides'}
        description={
          isDe
            ? 'Praxisnahe Leitfäden zu EU Cloud VPS, DSGVO-konformem Hosting, verschlüsseltem SFTP-Storage und dedizierten Root-Servern.'
            : 'Practical guides on EU Cloud VPS, GDPR-compliant hosting, encrypted SFTP backup storage, and dedicated bare-metal servers.'
        }
        path={isDe ? '/de/guides' : '/guides'}
      />

      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text)] pt-28 lg:pt-32 pb-24">
        <div className="vs-container space-y-12">
          <header className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--accent-bright)]">
              <BookOpen className="w-3.5 h-3.5" />
              {isDe ? 'Infrastruktur-Wissen' : 'Infrastructure Reference'}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--text)]">
              {isDe ? 'Technische Guides & Themen' : 'Technical Guides & Architecture'}
            </h1>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              {isDe
                ? 'Ausführliche Fachartikel zu europäischem Cloud-Hosting, DSGVO-Anforderungen, ZFS-SFTP-Backups und Bare-Metal-Infrastruktur.'
                : 'In-depth technical guides covering European cloud hosting, GDPR compliance, ZFS SFTP backup architecture, and dedicated hardware.'}
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {SEO_GUIDES.map((guide) => {
              const content = isDe ? guide.de : guide.en;
              return (
                <article
                  key={guide.slug}
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] p-6 flex flex-col justify-between gap-5 hover:border-[var(--accent-bright)]/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[var(--text-faint)]">
                      <span className="text-[var(--accent-bright)]">{content.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {content.readingTimeMin} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {guide.publishedAt}
                      </span>
                    </div>

                    <LocaleLink to={`/guides/${guide.slug}`} className="block">
                      <h2 className="text-lg font-semibold text-[var(--text)] hover:text-[var(--accent-bright)] transition-colors">
                        {content.title}
                      </h2>
                    </LocaleLink>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {content.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]">
                    <div className="flex flex-wrap gap-2">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-[var(--text-faint)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <LocaleLink
                      to={`/guides/${guide.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent-bright)] hover:underline"
                    >
                      <span>{isDe ? 'Lesen' : 'Read guide'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </LocaleLink>
                  </div>
                </article>
              );
            })}

            {unlistedPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] p-6 flex flex-col justify-between gap-5 hover:border-[var(--accent-bright)]/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[var(--text-faint)]">
                    <span className="text-[var(--accent-bright)]">{post.category || 'Guide'}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toISOString().slice(0, 10)}
                    </span>
                  </div>

                  <LocaleLink to={`/guides/${encodeURIComponent(post.slug)}`} className="block">
                    <h2 className="text-lg font-semibold text-[var(--text)] hover:text-[var(--accent-bright)] transition-colors">
                      {post.title}
                    </h2>
                  </LocaleLink>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                    {post.excerpt || post.content.replace(/<[^>]+>/g, '').slice(0, 180)}
                  </p>
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-[var(--line)]">
                  <LocaleLink
                    to={`/guides/${encodeURIComponent(post.slug)}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent-bright)] hover:underline"
                  >
                    <span>{isDe ? 'Lesen' : 'Read guide'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </LocaleLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
