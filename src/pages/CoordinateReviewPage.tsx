import { lazy, Suspense, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clipboard,
  ExternalLink,
  LocateFixed,
  MapPinned,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { locations } from '../data';
import type { LocationRecord } from '../types/data';
import {
  buildGoogleEarthUrl,
  buildGoogleSatelliteUrl,
  buildNominatimSearchUrl,
  buildOpenStreetMapUrl,
  createCoordinateIssueUrl,
  isMalaysiaCoordinate,
  type CoordinateCandidate,
} from '../utils/coordinates';

const LazyCoordinateMap = lazy(() =>
  import('../components/CoordinatePreviewMap').then(module => ({ default: module.CoordinatePreviewMap })),
);

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  osm_type?: string;
  osm_id?: number;
};

const sortedLocations = locations
  .filter(location => location.country === 'Malaysia')
  .sort((a, b) => `${a.organization} ${a.city ?? ''}`.localeCompare(`${b.organization} ${b.city ?? ''}`));

const initialLocation = sortedLocations[0];
const queryFor = (location: LocationRecord) => [
  location.organization,
  location.fullLocation ?? [location.city, location.state, 'Malaysia'].filter(Boolean).join(', '),
].filter(Boolean).join(', ');

export function CoordinateReviewPage() {
  const [locationId, setLocationId] = useState(initialLocation.locationId);
  const [query, setQuery] = useState(queryFor(initialLocation));
  const [results, setResults] = useState<CoordinateCandidate[]>([]);
  const [candidate, setCandidate] = useState<CoordinateCandidate | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const lastRequestAt = useRef(0);

  const selectedLocation = useMemo(
    () => sortedLocations.find(location => location.locationId === locationId) ?? initialLocation,
    [locationId],
  );

  const selectLocation = (nextId: string) => {
    const next = sortedLocations.find(location => location.locationId === nextId) ?? initialLocation;
    setLocationId(next.locationId);
    setQuery(queryFor(next));
    setResults([]);
    setCandidate(null);
    setLatitude('');
    setLongitude('');
    setMessage('');
    setCopied(false);
  };

  const selectCandidate = (next: CoordinateCandidate) => {
    setCandidate(next);
    setLatitude(String(next.latitude));
    setLongitude(String(next.longitude));
    setMessage('Candidate loaded. Cross-check the building and entrance before proposing publication.');
    setCopied(false);
  };

  const searchAddress = async (event: FormEvent) => {
    event.preventDefault();
    const cleaned = query.trim();
    if (cleaned.length < 4) {
      setStatus('error');
      setMessage('Enter a more specific public address or place name.');
      return;
    }
    if (Date.now() - lastRequestAt.current < 1100) {
      setStatus('error');
      setMessage('Please wait one second before another OpenStreetMap search.');
      return;
    }

    const cacheKey = `mygeomatics-geocode:${cleaned.toLocaleLowerCase()}`;
    const cached = sessionStorage.getItem(cacheKey);
    setStatus('searching');
    setMessage('');

    try {
      lastRequestAt.current = Date.now();
      const raw: NominatimResult[] = cached
        ? JSON.parse(cached)
        : await fetch(buildNominatimSearchUrl(cleaned), {
            headers: { Accept: 'application/json', 'Accept-Language': 'en-MY,en;q=0.8' },
          }).then(response => {
            if (!response.ok) throw new Error('Location service unavailable');
            return response.json() as Promise<NominatimResult[]>;
          });
      if (!cached) sessionStorage.setItem(cacheKey, JSON.stringify(raw));

      const candidates = raw
        .map(item => {
          const candidateLatitude = Number(item.lat);
          const candidateLongitude = Number(item.lon);
          return {
            latitude: candidateLatitude,
            longitude: candidateLongitude,
            displayName: item.display_name,
            source: 'OpenStreetMap Nominatim' as const,
            sourceUrl: item.osm_type && item.osm_id
              ? `https://www.openstreetmap.org/${item.osm_type}/${item.osm_id}`
              : buildOpenStreetMapUrl(candidateLatitude, candidateLongitude),
            osmType: item.osm_type,
            osmId: item.osm_id,
          };
        })
        .filter(item => isMalaysiaCoordinate(item.latitude, item.longitude));

      setResults(candidates);
      setStatus(candidates.length ? 'idle' : 'error');
      setMessage(candidates.length
        ? `${candidates.length} Malaysian candidate${candidates.length === 1 ? '' : 's'} found. Select one to inspect.`
        : 'No Malaysian candidate was returned. Refine the address or enter coordinates manually.');
    } catch {
      setStatus('error');
      setMessage('The public location search is temporarily unavailable. Manual coordinate review still works.');
    }
  };

  const previewManual = (event: FormEvent) => {
    event.preventDefault();
    const nextLatitude = Number(latitude);
    const nextLongitude = Number(longitude);
    if (!isMalaysiaCoordinate(nextLatitude, nextLongitude)) {
      setStatus('error');
      setMessage('Enter decimal-degree coordinates within Malaysia.');
      return;
    }
    setStatus('idle');
    selectCandidate({
      latitude: nextLatitude,
      longitude: nextLongitude,
      displayName: `Manual coordinate for ${selectedLocation.organization}`,
      source: 'Manual entry',
      sourceUrl: buildOpenStreetMapUrl(nextLatitude, nextLongitude),
    });
  };

  const copyCoordinates = async () => {
    if (!candidate) return;
    try {
      await navigator.clipboard.writeText(`${candidate.latitude}, ${candidate.longitude}`);
      setCopied(true);
    } catch {
      setMessage('Copy is unavailable in this browser. Select the coordinates shown above instead.');
    }
  };

  return (
    <div className="coordinate-workspace">
      <div className="page-intro coordinate-intro">
        <div>
          <p className="eyebrow">Coordinate verification workspace</p>
          <h2>Find, inspect and propose a map location.</h2>
          <p>Live search helps find candidates. Publication still requires human review and a traceable source.</p>
        </div>
        <div className="coordinate-status"><ShieldCheck/><span><strong>0 auto-published</strong><small>Every proposal is moderated</small></span></div>
      </div>

      <div className="coordinate-grid">
        <aside className="coordinate-controls">
          <section>
            <h3>Select directory record</h3>
            <label>
              Organisation or branch
              <select value={locationId} onChange={event => selectLocation(event.target.value)}>
                {sortedLocations.map(location => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.organization} - {location.city ?? location.state ?? location.locationId}
                  </option>
                ))}
              </select>
            </label>
            <dl className="record-summary">
              <div><dt>Location ID</dt><dd>{selectedLocation.locationId}</dd></div>
              <div><dt>Status</dt><dd>{selectedLocation.coordinatePublishable ? 'Published' : 'Pending review'}</dd></div>
              <div><dt>Address</dt><dd>{selectedLocation.fullLocation ?? 'Not recorded'}</dd></div>
            </dl>
          </section>

          <section>
            <h3>Search OpenStreetMap</h3>
            <form onSubmit={searchAddress}>
              <label>
                Public address or place
                <textarea value={query} onChange={event => setQuery(event.target.value)} rows={3} minLength={4} required />
              </label>
              <button className="button primary" type="submit" disabled={status === 'searching'}>
                <Search size={17}/>{status === 'searching' ? 'Searching...' : 'Find candidates'}
              </button>
            </form>
            <p className="source-note">Manual searches only, limited to Malaysia. Search results © OpenStreetMap contributors.</p>
          </section>

          <section>
            <h3>Or enter coordinates</h3>
            <form className="coordinate-pair" onSubmit={previewManual}>
              <label>Latitude<input inputMode="decimal" value={latitude} onChange={event => setLatitude(event.target.value)} placeholder="3.1390" required /></label>
              <label>Longitude<input inputMode="decimal" value={longitude} onChange={event => setLongitude(event.target.value)} placeholder="101.6869" required /></label>
              <button className="button secondary" type="submit"><LocateFixed size={17}/>Preview coordinate</button>
            </form>
          </section>
        </aside>

        <main className="coordinate-stage">
          <Suspense fallback={<div className="coordinate-preview-map"><div className="map-loading">Loading verification map</div></div>}>
            <LazyCoordinateMap candidate={candidate} />
          </Suspense>

          {message && <div className={`coordinate-message ${status === 'error' ? 'error' : ''}`}>{message}</div>}

          {results.length > 0 && (
            <section className="candidate-results">
              <div className="candidate-heading"><h3>Location candidates</h3><span>{results.length} results</span></div>
              {results.map(result => (
                <button
                  type="button"
                  key={`${result.osmType}-${result.osmId}-${result.latitude}`}
                  className={candidate?.latitude === result.latitude && candidate?.longitude === result.longitude ? 'selected' : ''}
                  onClick={() => selectCandidate(result)}
                >
                  <MapPinned/>
                  <span><strong>{result.displayName}</strong><small>{result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}</small></span>
                  <CheckCircle2/>
                </button>
              ))}
            </section>
          )}

          {candidate && (
            <section className="verification-panel">
              <div>
                <h3>Cross-check this candidate</h3>
                <p>{candidate.latitude.toFixed(6)}, {candidate.longitude.toFixed(6)}</p>
              </div>
              <div className="verification-links">
                <a href={buildOpenStreetMapUrl(candidate.latitude, candidate.longitude)} target="_blank" rel="noopener noreferrer">OpenStreetMap <ExternalLink/></a>
                <a href={buildGoogleSatelliteUrl(candidate.latitude, candidate.longitude)} target="_blank" rel="noopener noreferrer">Google satellite <ExternalLink/></a>
                <a href={buildGoogleEarthUrl(candidate.latitude, candidate.longitude)} target="_blank" rel="noopener noreferrer">Google Earth <ExternalLink/></a>
                <button type="button" onClick={copyCoordinates}><Clipboard/>{copied ? 'Copied' : 'Copy coordinates'}</button>
              </div>
              <div className="verification-checklist">
                <p><strong>Before submitting:</strong> confirm the building, city/state, branch identity and entrance using at least two references.</p>
                <a className="button primary" href={createCoordinateIssueUrl(selectedLocation, candidate)} target="_blank" rel="noopener noreferrer">
                  Propose coordinate on GitHub <ExternalLink/>
                </a>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
