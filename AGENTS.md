# VaultScope Storefront

## Stack

- **Language / Runtime**: TypeScript 6, Node 22
- **Framework**: React 19, Vite 8
- **Key dependencies**: React Router 7, Tailwind 4, Framer Motion, Three.js
- **Package manager**: npm

## Build approach

<TBD, set by /scope>

## Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Test
npx vitest run

# Lint
npm run lint

# Preview built app
npm run preview
```

## Rules

- React functional components with hooks (React 19)
- Tailwind 4 for styling with `clsx` and `tailwind-merge` for conditional classes
- Lazy loading for route components with React.lazy()
- i18n with context based German and English translations
- German routes use /de/ prefix (eg. /de/pricing)
- Testing with Vitest and React Testing Library
- Type safety with TypeScript strict mode
- Component structure: pages under src/pages/, reusable under src/components/

## Gotchas

- Vite environment variables (VITE_*) must be set at build time, not runtime
- German routing requires URL structure awareness (eg. LocaleLink component for navigation)
- Image optimization requires sharp package (note: sharp 0.35.3 has known vulnerabilities, update to 0.35.4+)
- Build command includes TypeScript compilation before Vite build
- Three.js used for 3D visualizations requires careful performance consideration

## Context files

- [src/i18n/AGENTS.md](src/i18n/AGENTS.md): Internationalization system for German/English support

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
