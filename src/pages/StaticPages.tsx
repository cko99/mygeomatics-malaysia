import { AlertTriangle, ArrowRight, Database, FileCheck2, MapPinOff, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataStatus } from '../data';
import { formatDateMY } from '../utils/data';

const REPOSITORY_URL = 'https://github.com/cko99/mygeomatics-malaysia';

export function ExplorePage() {
  return <div className="explore-grid"><Link to="/map"><MapPinOff/><span><strong>Explore map</strong><small>See reviewed coordinate coverage across Malaysia.</small></span><ArrowRight/></Link><Link to="/companies"><Database/><span><strong>Browse companies</strong><small>Search {dataStatus.uniqueOrganizations} unique organisations.</small></span><ArrowRight/></Link><Link to="/jobs"><FileCheck2/><span><strong>Review hiring signals</strong><small>Open source-linked career evidence.</small></span><ArrowRight/></Link><Link to="/insights/states"><ShieldCheck/><span><strong>Inspect insights</strong><small>Understand distribution and research gaps.</small></span><ArrowRight/></Link></div>;
}

export function InternshipsPage() {
  return <><div className="page-intro"><div><p className="eyebrow">Government & public sector · Private sector</p><h2>Internship discovery, without invented listings.</h2><p>This route is ready for qualified internship-specific records when they become available.</p></div></div><div className="empty-state large"><AlertTriangle/><h3>No reviewed internship listings are available in the current data snapshot.</h3><p>General hiring signals have not been relabelled as internships, and no allowance data is inferred.</p></div></>;
}

export function MethodologyPage() {
  const sections = [
    ['Purpose', 'MyGeomatics helps people discover Malaysia’s geomatics ecosystem through a public, source-led directory.'],
    ['Data model', 'Dashboard_Master contains one organisation-location per row. Organization_ID defines organisational uniqueness; branches retain distinct Location_ID values.'],
    ['Source hierarchy', 'Official organisational and government sources take priority, followed by cross-verified public evidence and clearly labelled community-supported records.'],
    ['Collection and verification', 'Records are staged in the canonical workbook, checked for required fields, normalised through a reproducible importer and published as a read-only snapshot.'],
    ['Verification tiers', 'The interface preserves official, cross-verified, partial, community-supported, unverified, unresolved and possibly inactive statuses when present.'],
    ['Coordinate policy', 'Only valid coordinates with a publishable reviewed status may render as markers. Missing locations are never replaced with city-centre or random coordinates.'],
    ['Hiring-signal policy', 'A source record is a signal, not a guaranteed vacancy. Public freshness labels combine source availability and observed date.'],
    ['Salary methodology', 'Salary statistics are withheld until a sufficient reviewed sample supports role, state, experience, range, median, time period and limitations.'],
    ['Corrections', 'Public proposals and corrections are previewed locally, then submitted as transparent GitHub issues for moderation before any dataset change.'],
    ['Limitations', 'Coverage reflects current public research. Low counts, missing contacts and zero coordinates can be data gaps rather than industry absence.'],
    ['Disclaimer', 'MyGeomatics is independent and does not imply endorsement by any government, organisation, platform or source.'],
    ['Update history', `Current snapshot: ${formatDateMY(dataStatus.snapshotDate)}. Import validation is recorded in reports/import-validation.json.`],
  ];
  return <div className="prose-page"><header><p className="eyebrow">How the data is handled</p><h2>Methodology that keeps uncertainty visible.</h2></header>{sections.map(([heading, body])=><section key={heading}><h3>{heading}</h3><p>{body}</p></section>)}</div>;
}

export function AboutPage() {
  return <div className="prose-page"><header><p className="eyebrow">Independent open-source MVP</p><h2>Making Malaysia’s geomatics ecosystem easier to navigate.</h2><p>MyGeomatics is designed for students, fresh graduates, professionals, career switchers, recruiters and universities.</p></header><section><h3>Mission</h3><p>Turn fragmented public industry evidence into a practical, transparent discovery interface.</p></section><section><h3>Scope</h3><p>The platform covers GIS, land survey, hydrography, remote sensing, drones, utility mapping, geospatial software, equipment, research and related fields.</p></section><section><h3>Independence</h3><p>This project is independently created and is not an official government directory. Source links remain the authority for organisational and opportunity claims.</p></section><section><h3>Roadmap</h3><p>The public MVP focuses on searchable organisations, source evidence, career signals and honest data-quality disclosure. Reviewed map coordinates and a moderated database workflow are the next priorities.</p></section><section><h3>Creator and contact</h3><p>Created by <strong>Luqman Abd Latif</strong>, a geomatics and GIS practitioner in Malaysia. View the source code, report a problem or contribute through the <a className="text-link" href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">MyGeomatics GitHub repository</a>.</p></section></div>;
}

export function DisclaimerPage() {
  return <div className="prose-page"><header><p className="eyebrow">Use responsibly</p><h2>Independent information, not professional advice.</h2></header><section><h3>No affiliation</h3><p>MyGeomatics is an independent open-source project. It is not affiliated with or endorsed by any Malaysian government agency, organisation, employer or data provider.</p></section><section><h3>Verify first</h3><p>Organisation, hiring and location records are discovery signals. Always verify important information using the linked official source before applying, contacting an organisation or making a professional decision.</p></section><section><h3>Coverage</h3><p>The dataset is incomplete and may contain stale, missing or incorrect information. Low counts can reflect research gaps rather than actual industry absence.</p></section></div>;
}

export function PrivacyPage() {
  return <div className="prose-page"><header><p className="eyebrow">Privacy</p><h2>A public MVP with minimal data collection.</h2></header><section><h3>Application data</h3><p>The current application is a static, read-only site and does not create user accounts or store form entries. Theme preference is stored only in your browser.</p></section><section><h3>Submissions</h3><p>Data proposals and corrections are sent only when you choose to continue to GitHub. GitHub’s own privacy terms apply there. Do not include personal, confidential or sensitive information.</p></section><section><h3>Public records</h3><p>The directory exposes only organisational information collected from public sources. Correction requests can be opened through the public GitHub repository.</p></section></div>;
}

export function DataStatusPage() {
  const values = [['Snapshot date',formatDateMY(dataStatus.snapshotDate)],['Unique organisations',dataStatus.uniqueOrganizations],['Organisation locations',dataStatus.locations],['Hiring signals',dataStatus.hiringSignals],['Reviewed coordinates',dataStatus.mapReadyLocations],['Unresolved records',dataStatus.unresolvedRecords],['Evidence records',dataStatus.evidenceRecords]];
  return <><div className="page-intro"><div><p className="eyebrow">Public MVP</p><h2>Current snapshot coverage and limitations.</h2><p>Counts are calculated during import and never hardcoded into the product.</p></div></div><div className="status-grid">{values.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="notice"><MapPinOff/><div><h3>Coordinate coverage is intentionally zero</h3><p>Locations stay discoverable in the directory while map publication awaits reviewed coordinates.</p></div></div><Link to="/methodology" className="text-link">Read methodology <ArrowRight/></Link></>;
}

export function NotFoundPage() {
  return <div className="error-page"><p className="eyebrow">404</p><h1>This route is outside the map.</h1><p>The page may have moved or the address may be incomplete.</p><Link className="button primary" to="/">Return home</Link></div>;
}
