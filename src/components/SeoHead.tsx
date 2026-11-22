import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_TITLE = 'VaultScope — Infrastructure and Software, Engineered Together';
const DEFAULT_DESCRIPTION =
  'VaultScope builds Cloud VPS, Dedicated Servers, and software on transparent, open-source infrastructure. German engineering. EU infrastructure.';
const DEFAULT_IMAGE = 'https://vaultscope.de/og-image.png';
const DOMAIN = 'https://vaultscope.de';

function normalizeLocalizedPaths(rawPath: string, locale: 'en' | 'de') {
  const clean = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const enPath =
    clean === '/de'
      ? '/'
      : clean.startsWith('/de/')
        ? clean.slice(3)
        : clean;
  const dePath = enPath === '/' ? '/de' : `/de${enPath}`;
  const canonicalPath = locale === 'de' ? dePath : enPath;

  return {
    enUrl: `${DOMAIN}${enPath === '/' ? '/' : enPath}`,
    deUrl: `${DOMAIN}${dePath}`,
    canonicalUrl: `${DOMAIN}${canonicalPath === '/' ? '/' : canonicalPath}`,
  };
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  author,
  noIndex = false,
  jsonLd,
}) => {
  const location = useLocation();
  const { locale } = useLanguage();
  const rawPath = path ?? location.pathname;
  const { enUrl, deUrl, canonicalUrl } = normalizeLocalizedPaths(rawPath, locale);

  const fullTitle = title
    ? title.includes('VaultScope')
      ? title
      : `${title} — VaultScope`
    : DEFAULT_TITLE;

  const fullImageUrl = image.startsWith('http')
    ? image
    : `${DOMAIN}${image.startsWith('/') ? '' : '/'}${image}`;

  const jsonLdSerialized = jsonLd ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : '';

  useEffect(() => {
    if (!jsonLdSerialized || typeof document === 'undefined') return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-vs-seo-jsonld', 'true');
    script.textContent = jsonLdSerialized;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [jsonLdSerialized]);

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {!noIndex && (
        <>
          <link rel="alternate" hrefLang="en" href={enUrl} />
          <link rel="alternate" hrefLang="de" href={deUrl} />
          <link rel="alternate" hrefLang="x-default" href={enUrl} />
        </>
      )}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Theme Color */}
      <meta name="theme-color" content="#0A0B0D" />
      <meta name="msapplication-TileColor" content="#0A0B0D" />

      {/* Open Graph (Facebook, Discord, Telegram, WhatsApp, LinkedIn) */}
      <meta property="og:site_name" content="VaultScope" />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale === 'de' ? 'de_DE' : 'en_US'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vaultscope" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article specific metadata */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
    </Helmet>
  );
};
