import { Link } from 'react-router-dom';
import { dataStatus } from '../data';
import { LazyMapView } from '../components/LazyMapView';

export function MapPage() {
  return <>
    <div className="map-page-head">
      <div>
        <p>{dataStatus.mapReadyLocations} verified locations from {dataStatus.locations} directory records</p>
        <span>The coverage hotspot is aggregated by state and is not a live organisation-location layer.</span>
      </div>
      <div className="map-page-actions">
        <Link to="/coordinate-review" className="button primary">Review coordinates</Link>
        <Link to="/companies" className="button secondary">Open directory</Link>
      </div>
    </div>
    <LazyMapView/>
  </>;
}
