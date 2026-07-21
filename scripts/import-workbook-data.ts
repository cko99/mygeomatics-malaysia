import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';

const root = resolve(import.meta.dirname, '..');
const input = resolve(root, 'data/import');

const text = z.string();
const dashboardSchema = z.object({
  Location_ID: text.min(1), Organization_ID: text.min(1), Organization: text.min(1), Parent_Organization: text,
  Organization_Type: text, Region_Group: text, Country: text, State: text, City: text, Secondary_Location: text,
  Full_Location: text, Latitude: text, Longitude: text, Geo_Accuracy: text, Coordinate_Source: text, Sector: text,
  Ownership: text, Primary_Subfield: text, All_Subfields: text, GIS: text, Land_Survey: text, Hydrography: text,
  Remote_Sensing: text, Drone_UAV: text, Utility_Mapping: text, Licensed_Firm: text, Licence_No: text,
  Licence_Type: text, Licensed_Surveyor: text, Website: text, Public_Email: text, Public_Phone: text,
  Verification_Status: text, Source_Type: text, Source_URL: text, Source_Sheet: text, Source_Row: text,
  Source_Note: text, Data_Quality_Flag: text, Last_Updated: text
}).strict();

const rowSchemas = {
  'Organization_Subfields.csv': z.object({ Organization_ID: text, Organization: text, Subfield: text, Value: text }).strict(),
  'Organization_Evidence.csv': z.object({ Evidence_ID: text, Organization_ID: text, Organization: text, Evidence_Type: text, Evidence_Status: text, Source_Title: text, Source_URL: text, Observed_On: text, Country: text, Notes: text }).strict(),
  'Hiring_Signals.csv': z.object({ Signal_ID: text, Organization_ID: text, Organization: text, Role_Title: text, Role_Family: text, Country: text, City: text, Work_Mode: text, Source_Platform: text, Job_URL: text, Observed_On: text, Recency_Status: text, Malaysia_Relevance: text, Verification_Note: text }).strict(),
  'Career_Path_Signals.csv': z.object({ Signal_ID: text, Anchor_Organization_ID: text, Anchor_Organization: text, Connected_Organization_ID: text, Connected_Organization: text, Relationship_Type: text, Function_Area: text, State: text, Source_Platform: text, Source_URL: text, Observed_On: text, Evidence_Strength: text, Connected_Master_Status: text, Verification_Note: text, Personal_Name_Stored: text }).strict(),
  'Unresolved_Records.csv': z.object({ Organization_ID: text, Organization: text, Original_Name: text, Verification_Status: text, Source_Sheet: text, Source_Row: text, Known_Information: text, Missing_or_Conflicting_Information: text, Review_Note: text, Recommended_Action: text }).strict()
} as const;

const nil = (value: string) => value.trim() === '' ? null : value.trim();
const bool = (value: string) => ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
const numberOrNull = (value: string) => value.trim() === '' || !Number.isFinite(Number(value)) ? null : Number(value);
const normalizeOrgType = (value: string) => ({ 'Private': 'Private Company', 'Govt': 'Government Agency' }[value.trim()] ?? (value.trim() || 'Unspecified'));
const safeUrl = (value: string) => { const v = nil(value); if (!v) return null; try { const url = new URL(v); return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null; } catch { return null; } };
const split = (value: string) => value.split(';').map(v => v.trim()).filter(Boolean);

async function csv(name: string) {
  const body = await readFile(resolve(input, name), 'utf8');
  return parse(body.replace(/^\uFEFF/, ''), { columns: true, skip_empty_lines: true, relax_column_count: true }) as Record<string, string>[];
}

async function writeJson(path: string, value: unknown) {
  const full = resolve(root, path); await mkdir(dirname(full), { recursive: true }); await writeFile(full, `${JSON.stringify(value, null, 2)}\n`);
}

const rawLocations = await csv('Dashboard_Master.csv');
const issues: Array<{ file: string; row: number; message: string }> = [];
const locations = rawLocations.flatMap((raw, index) => {
  const result = dashboardSchema.safeParse(raw);
  if (!result.success) { issues.push({ file: 'Dashboard_Master.csv', row: index + 2, message: z.prettifyError(result.error) }); return []; }
  const r = result.data; const latitude = numberOrNull(r.Latitude); const longitude = numberOrNull(r.Longitude);
  const coordinatePublishable = latitude !== null && longitude !== null && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !/unavailable|unverified|pending/i.test(r.Geo_Accuracy);
  return [{
    locationId: r.Location_ID, organizationId: r.Organization_ID, organization: r.Organization, parentOrganization: nil(r.Parent_Organization),
    organizationType: normalizeOrgType(r.Organization_Type), regionGroup: nil(r.Region_Group), country: nil(r.Country), state: nil(r.State), city: nil(r.City),
    secondaryLocation: nil(r.Secondary_Location), fullLocation: nil(r.Full_Location), latitude, longitude, geoAccuracy: nil(r.Geo_Accuracy),
    coordinateSource: nil(r.Coordinate_Source), coordinatePublishable, sector: nil(r.Sector), ownership: nil(r.Ownership), primarySubfield: nil(r.Primary_Subfield),
    allSubfields: split(r.All_Subfields), flags: { gis: bool(r.GIS), landSurvey: bool(r.Land_Survey), hydrography: bool(r.Hydrography), remoteSensing: bool(r.Remote_Sensing), droneUav: bool(r.Drone_UAV), utilityMapping: bool(r.Utility_Mapping) },
    licensedFirm: nil(r.Licensed_Firm), licenceNo: nil(r.Licence_No), licenceType: nil(r.Licence_Type), licensedSurveyor: nil(r.Licensed_Surveyor),
    website: safeUrl(r.Website), publicEmail: nil(r.Public_Email), publicPhone: nil(r.Public_Phone), verificationStatus: nil(r.Verification_Status) ?? 'Unverified',
    sourceType: nil(r.Source_Type), sourceUrl: safeUrl(r.Source_URL), sourceNote: nil(r.Source_Note), dataQualityFlags: split(r.Data_Quality_Flag), lastUpdated: nil(r.Last_Updated)
  }];
});

const readValidated = async <S extends z.ZodType>(file: string, schema: S): Promise<z.infer<S>[]> => {
  const rows = await csv(file); return rows.flatMap((row, index) => { const parsed = schema.safeParse(row); if (!parsed.success) { issues.push({ file, row: index + 2, message: z.prettifyError(parsed.error) }); return []; } return [parsed.data]; });
};
const subfieldRows = await readValidated('Organization_Subfields.csv', rowSchemas['Organization_Subfields.csv']);
const evidenceRows = await readValidated('Organization_Evidence.csv', rowSchemas['Organization_Evidence.csv']);
const hiringRows = await readValidated('Hiring_Signals.csv', rowSchemas['Hiring_Signals.csv']);
const careerRows = await readValidated('Career_Path_Signals.csv', rowSchemas['Career_Path_Signals.csv']);
const unresolvedRows = await readValidated('Unresolved_Records.csv', rowSchemas['Unresolved_Records.csv']);

const hiring = hiringRows.map(r => ({ signalId: r.Signal_ID, organizationId: r.Organization_ID, organization: r.Organization, roleTitle: r.Role_Title, roleFamily: nil(r.Role_Family), country: nil(r.Country), city: nil(r.City), workMode: nil(r.Work_Mode), sourcePlatform: nil(r.Source_Platform), jobUrl: safeUrl(r.Job_URL), observedOn: nil(r.Observed_On), sourceStatus: nil(r.Recency_Status), malaysiaRelevance: nil(r.Malaysia_Relevance), verificationNote: nil(r.Verification_Note) }));
const evidence = evidenceRows.map(r => ({ evidenceId: r.Evidence_ID, organizationId: r.Organization_ID, organization: r.Organization, evidenceType: nil(r.Evidence_Type), evidenceStatus: nil(r.Evidence_Status), sourceTitle: nil(r.Source_Title), sourceUrl: safeUrl(r.Source_URL), observedOn: nil(r.Observed_On), country: nil(r.Country), notes: nil(r.Notes) }));
const career = careerRows.map(r => ({ signalId: r.Signal_ID, organizationId: r.Anchor_Organization_ID, organization: r.Anchor_Organization, connectedOrganization: nil(r.Connected_Organization), relationshipType: nil(r.Relationship_Type), functionArea: nil(r.Function_Area), state: nil(r.State), sourcePlatform: nil(r.Source_Platform), sourceUrl: safeUrl(r.Source_URL), observedOn: nil(r.Observed_On), evidenceStrength: nil(r.Evidence_Strength), verificationNote: nil(r.Verification_Note) }));
const subfields = new Map<string, string[]>();
for (const row of subfieldRows) if (bool(row.Value)) subfields.set(row.Organization_ID, [...(subfields.get(row.Organization_ID) ?? []), row.Subfield]);
const organizations = [...new Map(locations.map(l => [l.organizationId, l])).values()].map(first => ({
  organizationId: first.organizationId, organization: first.organization, parentOrganization: first.parentOrganization, organizationType: first.organizationType,
  sector: first.sector, ownership: first.ownership, primarySubfield: first.primarySubfield, subfields: subfields.get(first.organizationId) ?? first.allSubfields,
  website: first.website, publicEmail: first.publicEmail, publicPhone: first.publicPhone, verificationStatus: first.verificationStatus,
  licensedFirm: first.licensedFirm, licenceNo: first.licenceNo, licenceType: first.licenceType, licensedSurveyor: first.licensedSurveyor,
  dataQualityFlags: [...new Set(locations.filter(l => l.organizationId === first.organizationId).flatMap(l => l.dataQualityFlags))],
  lastUpdated: locations.filter(l => l.organizationId === first.organizationId).map(l => l.lastUpdated).filter(Boolean).sort().at(-1) ?? null,
  locationIds: locations.filter(l => l.organizationId === first.organizationId).map(l => l.locationId),
  hiringSignalCount: hiring.filter(h => h.organizationId === first.organizationId).length
}));
const stateMap = new Map<string, { state: string; organizationIds: Set<string>; locations: number; hiringSignals: number; mapReady: number }>();
for (const l of locations) { if (!l.state) continue; const s = stateMap.get(l.state) ?? { state: l.state, organizationIds: new Set(), locations: 0, hiringSignals: 0, mapReady: 0 }; s.organizationIds.add(l.organizationId); s.locations++; if (l.coordinatePublishable) s.mapReady++; stateMap.set(l.state, s); }
for (const h of hiring) { const state = locations.find(l => l.organizationId === h.organizationId)?.state; if (state && stateMap.has(state)) stateMap.get(state)!.hiringSignals++; }
const stateSummary = [...stateMap.values()].map(s => ({ state: s.state, uniqueOrganizations: s.organizationIds.size, locations: s.locations, hiringSignals: s.hiringSignals, mapReady: s.mapReady })).sort((a,b) => b.uniqueOrganizations - a.uniqueOrganizations);
const snapshotDate = locations.map(l => l.lastUpdated).filter(Boolean).sort().at(-1) ?? new Date().toISOString().slice(0, 10);
const status = { snapshotDate, uniqueOrganizations: organizations.length, locations: locations.length, hiringSignals: hiring.length, mapReadyLocations: locations.filter(l => l.coordinatePublishable).length, unresolvedRecords: unresolvedRows.length, evidenceRecords: evidence.length, careerPathSignals: career.length };

await Promise.all([
  writeJson('src/data/generated/organizations.json', organizations), writeJson('src/data/generated/locations.json', locations),
  writeJson('src/data/generated/hiring-signals.json', hiring), writeJson('src/data/generated/evidence.json', evidence),
  writeJson('src/data/generated/career-path-signals.json', career), writeJson('src/data/generated/state-summary.json', stateSummary),
  writeJson('src/data/generated/unresolved-records.json', unresolvedRows), writeJson('src/data/generated/data-status.json', status),
  writeJson('reports/import-validation.json', { generatedAt: new Date().toISOString(), source: 'geomatics_companies_workbook', files: ['Dashboard_Master.csv', ...Object.keys(rowSchemas)], status, issues })
]);
if (issues.length) { console.error(`Import failed with ${issues.length} validation issue(s). See reports/import-validation.json.`); process.exit(1); }
console.log(`Imported ${status.uniqueOrganizations} organisations, ${status.locations} locations, ${status.hiringSignals} hiring signals, ${status.mapReadyLocations} map-ready locations.`);
