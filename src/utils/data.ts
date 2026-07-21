import type { HiringSignal, LocationRecord, Organization } from '../types/data';

export const uniqueOrganizationCount = (rows: Pick<LocationRecord,'organizationId'>[]) => new Set(rows.map(r => r.organizationId)).size;
export const mapReadyLocations = (rows: LocationRecord[]) => rows.filter(r => r.coordinatePublishable && r.latitude !== null && r.longitude !== null);
export const searchOrganizations = (rows: Organization[], query: string) => { const q=query.trim().toLocaleLowerCase(); return q ? rows.filter(r => [r.organization,r.organizationType,r.sector,r.primarySubfield,...r.subfields].filter(Boolean).some(v => String(v).toLocaleLowerCase().includes(q))) : rows; };
export const filterLocationsByState = (rows: LocationRecord[], state: string) => state ? rows.filter(r => r.state === state) : rows;
export const safeExternalUrl = (value: string | null) => { if (!value) return null; try { const url=new URL(value); return ['http:','https:'].includes(url.protocol) ? url.toString() : null; } catch { return null; } };
export type HiringPublicStatus='Recently observed'|'Verify before applying'|'Possibly expired'|'Source unavailable';
export const getHiringStatus = (signal: HiringSignal, now = new Date()) : HiringPublicStatus => {
  if (!safeExternalUrl(signal.jobUrl)) return 'Source unavailable';
  if (!signal.observedOn) return 'Verify before applying';
  const observed = new Date(`${signal.observedOn}T00:00:00+08:00`); if (Number.isNaN(observed.getTime())) return 'Verify before applying';
  const days = Math.floor((now.getTime()-observed.getTime())/86400000);
  if (days <= 45) return 'Recently observed'; if (days <= 120) return 'Verify before applying'; return 'Possibly expired';
};
export const formatDateMY = (value:string|null) => value ? new Intl.DateTimeFormat('en-MY',{day:'2-digit',month:'short',year:'numeric',timeZone:'Asia/Kuala_Lumpur'}).format(new Date(`${value}T00:00:00+08:00`)) : 'Not recorded';
