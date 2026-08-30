import type { LocationRecord } from '../types/data';

export type CoordinateCandidate = {
  latitude: number;
  longitude: number;
  displayName: string;
  source: 'OpenStreetMap Nominatim' | 'Manual entry';
  sourceUrl: string;
  osmType?: string;
  osmId?: number;
};

export const isMalaysiaCoordinate = (latitude: number, longitude: number) =>
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= 0.5 &&
  latitude <= 7.8 &&
  longitude >= 99 &&
  longitude <= 120;

export function buildNominatimSearchUrl(query: string) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    countrycodes: 'my',
    limit: '5',
    addressdetails: '1',
  });
  return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
}

export const buildOpenStreetMapUrl = (latitude: number, longitude: number) =>
  `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;

export function buildGoogleSatelliteUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    api: '1',
    map_action: 'map',
    center: `${latitude},${longitude}`,
    zoom: '18',
    basemap: 'satellite',
  });
  return `https://www.google.com/maps/@?${params.toString()}`;
}

export const buildGoogleEarthUrl = (latitude: number, longitude: number) =>
  `https://earth.google.com/web/search/${encodeURIComponent(`${latitude},${longitude}`)}`;

export function createCoordinateIssueUrl(location: LocationRecord, candidate: CoordinateCandidate) {
  const params = new URLSearchParams({
    title: `[Coordinate review] ${location.organization} - ${location.locationId}`,
    body: [
      '### Location record',
      `- Organisation: ${location.organization}`,
      `- Organization ID: ${location.organizationId}`,
      `- Location ID: ${location.locationId}`,
      `- Published address: ${location.fullLocation ?? 'Not recorded'}`,
      '',
      '### Proposed coordinate',
      `- Latitude: ${candidate.latitude}`,
      `- Longitude: ${candidate.longitude}`,
      `- Search result: ${candidate.displayName}`,
      `- Candidate source: ${candidate.source}`,
      `- Source URL: ${candidate.sourceUrl}`,
      candidate.osmType && candidate.osmId ? `- OSM object: ${candidate.osmType}/${candidate.osmId}` : null,
      '',
      '### Cross-check',
      `- OpenStreetMap: ${buildOpenStreetMapUrl(candidate.latitude, candidate.longitude)}`,
      `- Google satellite: ${buildGoogleSatelliteUrl(candidate.latitude, candidate.longitude)}`,
      `- Google Earth: ${buildGoogleEarthUrl(candidate.latitude, candidate.longitude)}`,
      '',
      '### Reviewer checklist',
      '- [ ] The marker matches the organisation or branch entrance/building.',
      '- [ ] The city and state match the published location record.',
      '- [ ] At least two independent map references were checked.',
      '- [ ] No private residential location or sensitive information is included.',
      '- [ ] I understand this is a proposal and not an automatic publication.',
    ].filter(Boolean).join('\n'),
  });
  return `https://github.com/cko99/mygeomatics-malaysia/issues/new?${params.toString()}`;
}
