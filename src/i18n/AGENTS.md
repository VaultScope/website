# Internationalization (i18n)

## Overview

Context based i18n system supporting German and English locales with URL based language switching. German routes use /de/ prefix, English is default. Translations organized by feature area in locale files.

## Key files

| File | Owns |
|---|---|
| index.ts | Language detection, LanguageProvider setup |
| context.tsx | React context and hooks (useTranslation, useLanguage) |
| LocaleLink.tsx | Locale aware Link component preserving language across navigation |
| locales/en/*.ts | English translations by feature (home, nav, infrastructure, etc) |
| locales/de/*.ts | German translations mirroring English structure |

## Conventions

- Translation keys use nested objects exported from locale files
- Each feature has its own translation file (home.ts, nav.ts, pricing.ts, etc)
- LocaleLink wraps React Router Link to preserve locale prefix
- Language detection order: URL path → localStorage → browser preference → default (en)
- All user facing strings must be translatable, no hardcoded text
- German routes accessible via /de/ prefix (eg. /de/pricing maps to German pricing page)

## Gotchas

- Adding new routes requires both English and German translations
- LocaleLink must be used instead of React Router Link for internal navigation
- Translation files must maintain identical structure across locales
- Language prefix in URL is read only (German), not written (English)
- Missing translation keys fall back to key name, not English text

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
