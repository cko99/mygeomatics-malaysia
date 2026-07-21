# Phase 2 plan

Phase 2 is not implemented. The prepared boundary keeps generated static data behind a data module so it can later be replaced by a read-only API.

Planned architecture: Cloudflare Pages frontend, Cloudflare Workers API, Supabase PostgreSQL with PostGIS, Supabase Auth for one admin, R2 for files and Turnstile for public forms. Work begins only after explicit approval and current official free-tier/pricing verification.

Priorities: schema migrations; public/private data separation; RLS tests; read-only public API; moderated submissions/reports; server-side Turnstile; restricted uploads; idempotent Sheet import with diff preview; coordinate review queue; audit logs; backups.
