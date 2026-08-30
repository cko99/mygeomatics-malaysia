# MyGeomatics

MyGeomatics is an independent Malaysia Company & Career Map for discovering geomatics organisations, public hiring signals and industry coverage. Version 0.3 is a static, read-only public MVP built with Vite, React, TypeScript, Tailwind CSS and MapLibre GL JS.

**Live MVP:** <https://mygeomatics-malaysia.pages.dev>

## MVP capabilities

- Search and filter 243 organisations across 245 location records.
- Review organisation profiles, source evidence and data-quality flags.
- Explore public hiring signals without presenting them as guaranteed vacancies.
- Compare state, sector and hiring coverage through transparent insights.
- Preview data proposals or corrections locally, then submit them through a moderated GitHub issue.
- Search OpenStreetMap for coordinate candidates, inspect them on a map and cross-check with OpenStreetMap, Google Maps satellite view and Google Earth.
- View a state-level research coverage hotspot separately from reviewed organisation locations.
- Inspect the published snapshot date, unresolved records and coordinate limitations.

## Local setup

```bash
npm install
npm run data:import
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Updating the data snapshot

Export the required tabs from the [canonical workbook](https://docs.google.com/spreadsheets/d/1mUV4WYR3VL9kobwSY3SF-NwzVRU5WGKyJMgkXXKRPOc/edit) to `data/import/` using the exact filenames documented in [docs/data-import.md](docs/data-import.md), then run:

```bash
npm run data:import
npm run test
npm run build
```

Generated application data lives in `src/data/generated/`; the validation report is `reports/import-validation.json`.

## Deployment

The static `dist/` output targets Cloudflare Pages. Configure build command `npm run build` and output directory `dist`. SPA fallback rules and security headers are committed under `public/`.

## Coordinate verification

The coordinate workspace intentionally separates discovery from publication. Search results and manually entered coordinates are candidates only; a maintainer must review the building, branch, city/state and source before updating the canonical dataset. See [docs/coordinate-verification.md](docs/coordinate-verification.md) for the workflow and map-source rules.

## Current version and limitations

The public v0.3 MVP is deployed on Cloudflare Pages. The workbook currently contains no reviewed organisation coordinates, insufficient internship-specific data and no reliable salary dataset. The public hotspot uses labelled state-level display anchors and is never presented as organisation location data. Missing organisation coordinates stay in the directory and are never approximated. Data proposals and corrections are moderated through public GitHub issues; no application backend, account system or continuous location tracking is enabled.
