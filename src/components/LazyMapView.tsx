import { lazy, Suspense } from 'react';
const LazyMap = lazy(() => import('./MapView').then(module => ({ default: module.MapView })));
export function LazyMapView({compact=false}:{compact?:boolean}){return <Suspense fallback={<div className={`map-panel ${compact?'compact':''}`}><div className="map-loading">Loading map canvas</div></div>}><LazyMap compact={compact}/></Suspense>}
