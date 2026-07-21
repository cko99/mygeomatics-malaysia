import { describe, expect, it } from 'vitest'; import { filterLocationsByState, getHiringStatus, mapReadyLocations, safeExternalUrl, searchOrganizations, uniqueOrganizationCount } from './data'; import type { HiringSignal, LocationRecord, Organization } from '../types/data';
const location=(id:string,state='Selangor',publishable=false)=>({organizationId:id,state,coordinatePublishable:publishable,latitude:publishable?3:null,longitude:publishable?101:null} as LocationRecord);
describe('data utilities',()=>{
  it('counts unique organisations instead of rows',()=>expect(uniqueOrganizationCount([location('A'),location('A'),location('B')])).toBe(2));
  it('filters locations by state',()=>expect(filterLocationsByState([location('A'),location('B','Johor')],'Johor')).toHaveLength(1));
  it('searches company and subfield text',()=>{const rows=[{organization:'Spatial Lab',organizationType:'Research',sector:'Education',primarySubfield:'GIS',subfields:['Remote Sensing']} as Organization];expect(searchOrganizations(rows,'remote')).toHaveLength(1);expect(searchOrganizations(rows,'marine')).toHaveLength(0)});
  it('never treats missing coordinates as map ready',()=>expect(mapReadyLocations([location('A'),location('B','Johor',true)])).toHaveLength(1));
  it('rejects malformed and unsafe links',()=>{expect(safeExternalUrl('javascript:alert(1)')).toBeNull();expect(safeExternalUrl('not a url')).toBeNull();expect(safeExternalUrl('https://example.com')).toBe('https://example.com/')});
  it('calculates honest hiring freshness',()=>{const base={jobUrl:'https://example.com/job',observedOn:'2026-07-10'} as HiringSignal;expect(getHiringStatus(base,new Date('2026-07-21T00:00:00+08:00'))).toBe('Recently observed');expect(getHiringStatus({...base,observedOn:'2026-01-01'},new Date('2026-07-21T00:00:00+08:00'))).toBe('Possibly expired');expect(getHiringStatus({...base,jobUrl:null})).toBe('Source unavailable')});
});
