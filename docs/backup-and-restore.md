# Backup and restore

Phase 1 source data is recoverable from the canonical Google workbook, committed CSV exports and generated JSON. To restore, check out a known commit, run `npm ci`, `npm run data:import`, `npm test` and `npm run build`.

Phase 2 must add weekly database exports, four weekly retentions, three monthly snapshots, pre-migration backups, a storage manifest and a tested restore drill. No database exists in Phase 1.
