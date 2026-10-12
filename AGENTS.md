# VaultScope Storefront

## Verified Commands
- Install: `npm i`
- Dev Server: `npm run dev`
- Build: `npm run build` (tsc -b && vite build)
- Lint: `npm run lint` (oxlint)
- Test: `npx vitest run`

## Invariants & Conventions
- React 19 functional components with hooks.
- Tailwind 4 for styling with `clsx` and `tailwind-merge`.
- Lazy loading for route components with React.lazy().
- i18n with context-based German and English translations (German routes use `/de/` prefix).
- Types are currently defined inline or duplicated; do not assume backend types match without verifying.

## Interfaces to Ecosystem
- **API**: Connects exclusively to `VaultScope-API` endpoints under `/api/storefront/*`.
- **Admin**: No direct link. Data modified by Admin will be reflected via the API.
- All backend communication handled via `src/lib/api.ts` which automatically attaches JWTs from `localStorage` (`vs_token`).

## No-Go Areas & Pitfalls
- **State Updates**: React tests must wrap state updates in `act(...)`.
- **Environment**: `VITE_*` env vars are strictly build-time.
- **Images**: `sharp` package requires specific version updates due to vulnerabilities.
- **3D**: `three.js` is used; watch for memory leaks in unmounted components.

## Detail Docs
- [API Contract](/CONTRACT_MISMATCHES.md)
- [Auth Flow](docs/auth.md)
