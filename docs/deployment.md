# Deployment

Target: Cloudflare Pages with Git integration.

Production URL: <https://mygeomatics-malaysia.pages.dev>

- Repository: `cko99/mygeomatics-malaysia`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`
- Node runtime: `22` (pinned by `.node-version`)
- Runtime secrets: none

`wrangler.jsonc` records the Pages project name and build output. `public/_redirects`
enables direct-route SPA refresh. `public/_headers` supplies security headers.

## Cloudflare project configuration

The GitHub repository is connected to the existing Cloudflare Pages project. A
push to `main` triggers the production build. To recreate the project:

1. Sign in to the Cloudflare dashboard and open **Workers & Pages**.
2. Select **Create application**, then **Pages**, then **Connect to Git**.
3. Authorise GitHub if prompted and select `cko99/mygeomatics-malaysia`.
4. Set the project name to `mygeomatics-malaysia` and the production branch to
   `main`.
5. Choose the **Vite** framework preset and confirm:
   - build command: `npm run build`;
   - build output directory: `dist`;
   - root directory: `/`.
6. In build environment variables, set `NODE_VERSION` to `22`. No application
   secrets or runtime variables are required.
7. Save and deploy. Cloudflare will build `main` for production and other branches,
   including `feature/phase-1-static-mvp`, as preview deployments.

Before a release is considered complete, confirm the GitHub quality checks and
Cloudflare production deployment, then verify direct routes, responsive navigation,
theme switching, directory search, the map disclosure and security headers.
