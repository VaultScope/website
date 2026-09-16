# VaultScope Storefront

## Build approach

<TBD, set by /scope>

## Rules

- React functional components with hooks (React 19)
- Tailwind 4 for styling with `clsx` and `tailwind-merge` for conditional classes
- Lazy loading for route components with React.lazy()
- i18n with context based German and English translations
- German routes use /de/ prefix (eg. /de/pricing)
- Testing with Vitest and React Testing Library
- Type safety with TypeScript strict mode

## Gotchas

- Vite environment variables (VITE_*) must be set at build time, not runtime
- German routing requires URL structure awareness (eg. LocaleLink component for navigation)
- Image optimization requires sharp package (note: sharp 0.35.3 has known vulnerabilities, update to 0.35.4+)
- Build command includes TypeScript compilation before Vite build
- Three.js used for 3D visualizations requires careful performance consideration

## Context files

- [src/i18n/AGENTS.md](src/i18n/AGENTS.md): Internationalization system for German/English support

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
