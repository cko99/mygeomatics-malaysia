import { describe, expect, it } from 'vitest';
import {
  buildGoogleSatelliteUrl,
  buildNominatimSearchUrl,
  buildOpenStreetMapUrl,
  createCoordinateIssueUrl,
  isMalaysiaCoordinate,
} from './coordinates';
import type { LocationRecord } from '../types/data';

const location = {
  locationId: 'LOC-0001',
  organizationId: 'ORG-0001',
  organization: 'Example Geomatics',
  fullLocation: 'Kuala Lumpur, Malaysia',
} as LocationRecord;

describe('coordinate verification utilities', () => {
  it('accepts Malaysian coordinates and rejects out-of-country coordinates', () => {
    expect(isMalaysiaCoordinate(3.139, 101.6869)).toBe(true);
    expect(isMalaysiaCoordinate(35.6762, 139.6503)).toBe(false);
  });

  it('limits Nominatim search to Malaysia', () => {
    const url = new URL(buildNominatimSearchUrl('JUPEM Kuala Lumpur'));
    expect(url.hostname).toBe('nominatim.openstreetmap.org');
    expect(url.searchParams.get('countrycodes')).toBe('my');
    expect(url.searchParams.get('limit')).toBe('5');
  });

  it('builds external cross-check links from coordinates', () => {
    expect(buildOpenStreetMapUrl(3.139, 101.6869)).toContain('mlat=3.139');
    const google = new URL(buildGoogleSatelliteUrl(3.139, 101.6869));
    expect(google.searchParams.get('basemap')).toBe('satellite');
  });

  it('creates a moderated coordinate proposal', () => {
    const url = new URL(createCoordinateIssueUrl(location, {
      latitude: 3.139,
      longitude: 101.6869,
      displayName: 'Kuala Lumpur, Malaysia',
      source: 'Manual entry',
      sourceUrl: buildOpenStreetMapUrl(3.139, 101.6869),
    }));
    expect(url.hostname).toBe('github.com');
    expect(url.searchParams.get('title')).toContain('[Coordinate review]');
    expect(url.searchParams.get('body')).toContain('At least two independent map references');
  });
});
