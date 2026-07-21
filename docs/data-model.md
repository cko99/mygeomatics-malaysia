# Data model

`Dashboard_Master` is canonical at the organisation-location grain. `Organization_ID` identifies one organisation; `Location_ID` identifies a branch or location. Unique company counts must deduplicate `Organization_ID`.

Generated entities:

- `organizations.json`: one record per `Organization_ID`.
- `locations.json`: one record per `Location_ID`, including publishable coordinate status.
- `hiring-signals.json`: public source observations, not guaranteed vacancies.
- `evidence.json`: public organisational evidence.
- `career-path-signals.json`: organisation/function signals with personal names excluded.
- `state-summary.json`: derived state counts.
- `unresolved-records.json`: retained research gaps.
- `data-status.json`: calculated snapshot counts and date.

Null means missing or not supplied. The importer does not infer coordinates, websites, contacts, vacancies or verification.
