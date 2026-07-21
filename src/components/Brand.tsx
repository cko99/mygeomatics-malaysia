import { Link } from 'react-router-dom';
export function Brand({compact=false}:{compact?:boolean}){return <Link to="/" className="brand" aria-label="MyGeomatics home"><img src="/logo-mark.svg" alt=""/><span><strong>MyGeomatics</strong>{!compact&&<small>Malaysia Company & Career Map</small>}</span></Link>}
