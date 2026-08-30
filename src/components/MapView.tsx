import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Flame, Layers3, LocateFixed, MapPin, RotateCcw } from 'lucide-react';
import { locations, stateSummary } from '../data';
import { coverageAnchors } from '../data/coverage-anchors';
import { mapReadyLocations } from '../utils/data';

const styles = {
  Light: 'https://tiles.openfreemap.org/styles/positron',
  Streets: 'https://tiles.openfreemap.org/styles/liberty',
  Dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;

const terrain: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
    dem: {
      type: 'raster-dem',
      url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
      tileSize: 256,
    },
  },
  layers: [
    { id: 'osm', type: 'raster', source: 'osm' },
    { id: 'hillshade', type: 'hillshade', source: 'dem' },
  ],
  terrain: { source: 'dem', exaggeration: 1 },
};

type MapLayer = 'coverage' | 'verified';

export function MapView({ compact = false }: { compact?: boolean }) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [style, setStyle] = useState<keyof typeof styles | 'Terrain'>('Streets');
  const [layer, setLayer] = useState<MapLayer>('coverage');
  const ready = useMemo(() => mapReadyLocations(locations), []);
  const coverage = useMemo(() => {
    const maximum = Math.max(...stateSummary.map(item => item.uniqueOrganizations), 1);
    return {
      type: 'FeatureCollection' as const,
      features: stateSummary.flatMap(item => {
        const coordinate = coverageAnchors[item.state];
        return coordinate ? [{
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coordinate },
          properties: {
            state: item.state,
            organizations: item.uniqueOrganizations,
            locations: item.locations,
            weight: item.uniqueOrganizations / maximum,
          },
        }] : [];
      }),
    };
  }, []);

  useEffect(() => {
    if (!element.current) return;
    const instance = new maplibregl.Map({
      container: element.current,
      style: style === 'Terrain' ? terrain : styles[style],
      center: [109.5, 4.2],
      zoom: 4.2,
      pitch: style === 'Terrain' ? 35 : 0,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));
    instance.addControl(new maplibregl.FullscreenControl());

    instance.on('load', () => {
      instance.addSource('research-coverage', { type: 'geojson', data: coverage });
      instance.addLayer({
        id: 'coverage-heat',
        type: 'heatmap',
        source: 'research-coverage',
        maxzoom: 8.5,
        layout: { visibility: layer === 'coverage' ? 'visible' : 'none' },
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 3, 0.8, 8, 2.2],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 3, 24, 8, 54],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0.9, 8.5, 0.25],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(239,117,64,0)',
            0.25, 'rgba(239,117,64,0.3)',
            0.55, 'rgba(215,91,34,0.62)',
            0.8, 'rgba(156,60,19,0.82)',
            1, 'rgba(105,36,8,0.94)',
          ],
        },
      });
      instance.addLayer({
        id: 'coverage-points',
        type: 'circle',
        source: 'research-coverage',
        minzoom: 5.8,
        layout: { visibility: layer === 'coverage' ? 'visible' : 'none' },
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'organizations'], 1, 5, 47, 15],
          'circle-color': '#d75b22',
          'circle-opacity': 0.82,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
        },
      });
      instance.on('click', 'coverage-points', event => {
        const feature = event.features?.[0];
        if (!feature?.properties || feature.geometry.type !== 'Point') return;
        new maplibregl.Popup({ offset: 14 })
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setText(`${feature.properties.state}: ${feature.properties.organizations} organisations across ${feature.properties.locations} directory locations`)
          .addTo(instance);
      });
      instance.on('mouseenter', 'coverage-points', () => { instance.getCanvas().style.cursor = 'pointer'; });
      instance.on('mouseleave', 'coverage-points', () => { instance.getCanvas().style.cursor = ''; });
    });

    if (layer === 'verified') {
      for (const location of ready) {
        const node = document.createElement('button');
        node.className = 'map-marker';
        node.type = 'button';
        node.setAttribute('aria-label', `${location.organization}, ${location.city}, ${location.state}`);
        new maplibregl.Marker({ element: node })
          .setLngLat([location.longitude!, location.latitude!])
          .setPopup(new maplibregl.Popup({ offset: 18 }).setText(`${location.organization}, ${location.city ?? ''}, ${location.state ?? ''}`))
          .addTo(instance);
      }
    }

    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
  }, [style, layer, ready, coverage]);

  return (
    <section className={`map-panel ${compact ? 'compact' : ''}`}>
      <div ref={element} className="map-canvas" aria-label="Interactive map of Malaysia" />
      <div className="map-toolbar">
        <label><Layers3 size={16}/><span className="sr-only">Basemap</span><select value={style} onChange={event => setStyle(event.target.value as keyof typeof styles | 'Terrain')}>{[...Object.keys(styles), 'Terrain'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>{layer === 'coverage' ? <Flame size={16}/> : <MapPin size={16}/>}<span className="sr-only">Data layer</span><select value={layer} onChange={event => setLayer(event.target.value as MapLayer)}><option value="coverage">Research coverage</option><option value="verified">Verified locations</option></select></label>
        <button onClick={() => map.current?.flyTo({ center: [109.5, 4.2], zoom: 4.2, pitch: 0 })}><RotateCcw size={16}/>Reset</button>
        <button onClick={() => navigator.geolocation?.getCurrentPosition(position => map.current?.flyTo({ center: [position.coords.longitude, position.coords.latitude], zoom: 10 }))}><LocateFixed size={16}/>Locate</button>
      </div>
      {layer === 'verified' && ready.length === 0 && <div className="map-empty"><strong>No reviewed coordinates yet</strong><span>Use Coordinate Review to propose the first verified locations.</span></div>}
      <div className="map-note"><span className="legend-dot"/>{layer === 'coverage' ? 'State-level research coverage. Anchors are not organisation coordinates.' : 'Only reviewed organisation coordinates appear in this layer.'}</div>
    </section>
  );
}
