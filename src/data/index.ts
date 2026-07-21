import organizationsJson from './generated/organizations.json';
import locationsJson from './generated/locations.json';
import hiringJson from './generated/hiring-signals.json';
import evidenceJson from './generated/evidence.json';
import careerJson from './generated/career-path-signals.json';
import statesJson from './generated/state-summary.json';
import statusJson from './generated/data-status.json';
import type { CareerSignal, DataStatus, Evidence, HiringSignal, LocationRecord, Organization, StateSummary } from '../types/data';

export const organizations = organizationsJson as Organization[];
export const locations = locationsJson as LocationRecord[];
export const hiringSignals = hiringJson as HiringSignal[];
export const evidence = evidenceJson as Evidence[];
export const careerSignals = careerJson as CareerSignal[];
export const stateSummary = statesJson as StateSummary[];
export const dataStatus = statusJson as DataStatus;
