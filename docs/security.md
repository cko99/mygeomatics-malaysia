# Security baseline

Phase 1 contains no secrets, credentials, backend writes or private user data. External URLs are restricted to HTTP/HTTPS during import and opened with `noopener noreferrer`. Imported data is rendered as React text; neither `dangerouslySetInnerHTML` nor MapLibre raw HTML is used.

Cloudflare headers configure CSP, MIME-sniffing protection, strict referrer policy, frame denial and a restrictive permissions policy. CSP permits the selected OpenFreeMap and MapLibre demo tile hosts, blob workers, same-origin scripts/assets and no objects or framing.

MapLibre basemaps use public, non-Google providers. Before production launch, verify provider terms, route refresh, map tiles and CSP on the deployed hostname. Run `npm audit` and document any accepted exception.
