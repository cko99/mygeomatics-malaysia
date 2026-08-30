import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { CoordinateCandidate } from '../utils/coordinates';

const mapStyle = 'https://tiles.openfreemap.org/styles/liberty';

export function CoordinatePreviewMap({ candidate }: { candidate: CoordinateCandidate | null }) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!element.current) return;
    const instance = new maplibregl.Map({
      container: element.current,
      style: mapStyle,
      center: [109.5, 4.2],
      zoom: 4.2,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current = instance;
    return () => {
      marker.current?.remove();
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    marker.current?.remove();
    marker.current = null;
    if (!candidate || !map.current) return;
    const node = document.createElement('span');
    node.className = 'candidate-marker';
    marker.current = new maplibregl.Marker({ element: node })
      .setLngLat([candidate.longitude, candidate.latitude])
      .addTo(map.current);
    map.current.flyTo({
      center: [candidate.longitude, candidate.latitude],
      zoom: 17,
      essential: false,
    });
  }, [candidate]);

  return (
    <div className="coordinate-preview-map">
      <div ref={element} className="map-canvas" aria-label="Coordinate candidate map" />
      {!candidate && <div className="map-empty"><strong>No candidate selected</strong><span>Search an address or enter a coordinate to preview it.</span></div>}
    </div>
  );
}
