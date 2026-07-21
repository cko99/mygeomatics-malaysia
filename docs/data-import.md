# Data import

Export these workbook tabs as CSV into `data/import/`:

```text
Dashboard_Master.csv
Organization_Subfields.csv
Organization_Evidence.csv
Hiring_Signals.csv
Career_Path_Signals.csv
Malaysia_By_State.csv
Location_Review.csv
Unresolved_Records.csv
```

Then run `npm run data:import`. The script validates expected headers with Zod, normalises blanks to null, normalises organisation types, parses booleans and semicolon-delimited subfields, validates public URL protocols, preserves public source fields and refuses to make missing coordinates publishable.

The generated JSON is committed as a resilient fallback. The browser never reads Google Sheets directly. Review `reports/import-validation.json` after every import.

Date-only values are preserved as calendar dates and displayed with Malaysian conventions. Actual client timestamps use `Asia/Kuala_Lumpur`.
