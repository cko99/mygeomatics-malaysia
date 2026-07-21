# Deployment

Target: Cloudflare Pages.

- Branch: `feature/phase-1-static-mvp`
- Build command: `npm run build`
- Output directory: `dist`
- Node runtime: current supported LTS or newer compatible with Vite 7

`public/_redirects` enables direct-route SPA refresh. `public/_headers` supplies security headers.

No remote repository or Cloudflare project was present at audit time, so a production/preview deployment cannot be created without the repository URL and authorised Cloudflare context. Do not create or overwrite an unrelated Pages project. Once configured: push the feature branch, open a draft PR, create a preview deployment, verify all routes and headers, then merge after approval and verify production HTTP 200.
