import {
  ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, GraduationCap,
  Map, SearchCheck, ShieldCheck, Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand';
import { ThemeControl } from '../components/ThemeControl';
import { dataStatus, stateSummary } from '../data';
import { LazyMapView } from '../components/LazyMapView';

const fields = ['GIS & geospatial', 'Land surveying', 'Hydrography', 'Remote sensing', 'Drone & UAV', 'Utility mapping'];

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav>
          <Link to="/map">Explore map</Link>
          <Link to="/coordinate-review">Coordinate review</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/jobs">Opportunities</Link>
          <Link to="/insights/states">Industry insights</Link>
          <Link to="/methodology">Methodology</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="nav-actions"><ThemeControl /><Link className="button primary" to="/explore">Launch platform</Link></div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Malaysia, mapped by its geomatics ecosystem</p>
            <h1>Discover Malaysia’s <em>Geomatics Ecosystem</em></h1>
            <p>Explore geomatics companies, career opportunities and industry activity across Malaysia through one transparent platform.</p>
            <div className="hero-actions"><Link className="button primary" to="/companies">Browse companies <ArrowRight size={18}/></Link><Link className="button secondary" to="/map">Explore the map</Link></div>
          </div>
          <div className="hero-product"><div className="preview-head"><span>Published data snapshot</span><strong>{dataStatus.uniqueOrganizations} organisations</strong></div><LazyMapView compact /></div>
        </section>
        <section className="stats" aria-label="Product statistics">
          {[[dataStatus.uniqueOrganizations,'unique organisations'],[dataStatus.locations,'organisation locations'],[dataStatus.hiringSignals,'hiring signals'],[stateSummary.length,'states & territories']].map(([number,label])=><div key={label}><strong>{number}</strong><span>{label}</span></div>)}
        </section>
        <section className="problem section">
          <div className="section-heading"><p className="eyebrow">One clearer starting point</p><h2>Industry discovery should not begin with scattered tabs and uncertain sources.</h2></div>
          <div className="problem-grid"><p>MyGeomatics organises public evidence into a searchable directory, while keeping uncertainty visible. It helps people find organisations without pretending every record is complete.</p><div className="principles"><span><SearchCheck/>Source-led discovery</span><span><ShieldCheck/>Visible verification status</span><span><Map/>Honest coordinate coverage</span></div></div>
        </section>
        <section className="audience section">
          <div className="section-heading"><h2>Built around the decisions people actually need to make.</h2></div>
          <div className="audience-rail">{[[GraduationCap,'Students','Find organisations to research for placements.'],[Users,'Early-career talent','Understand possible employers and fields.'],[BriefcaseBusiness,'Professionals','Explore activity near a preferred location.'],[Building2,'Universities & industry','Identify potential partners and coverage gaps.']].map(([Icon,title,body])=><article key={String(title)}><Icon/><h3>{title as string}</h3><p>{body as string}</p></article>)}</div>
        </section>
        <section className="fields section"><div><p className="eyebrow">Scope</p><h2>Geomatics is wider than a single job title.</h2><p>Organisations can belong to multiple subfields. The directory preserves that many-to-many structure.</p></div><div className="field-list">{fields.map((field,index)=><span key={field}><b>{String(index+1).padStart(2,'0')}</b>{field}</span>)}</div></section>
        <section className="workflow section"><div className="section-heading"><h2>A simple public workflow, backed by transparent limits.</h2></div><ol>{[['01','Search','Start with company, state or subfield.'],['02','Inspect','Review branches, sources and data-quality notes.'],['03','Verify','Open the official source before making a decision.']].map(([number,title,body])=><li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
        <section className="trust section"><div><ShieldCheck/><h2>Trust comes from showing what is missing.</h2></div><div><p>Coordinates are published only after review. Hiring records are presented as signals, not guaranteed vacancies. Low state counts may indicate research gaps.</p><Link to="/methodology">Read the methodology <ArrowRight size={17}/></Link></div></section>
        <section className="cta section"><CheckCircle2/><h2>Start exploring Malaysia’s geomatics landscape.</h2><p>The current MVP is public, searchable and honest about its limits.</p><Link to="/explore" className="button primary">Launch MyGeomatics <ArrowRight size={18}/></Link></section>
      </main>
      <footer>
        <Brand />
        <p>Independent open-source MVP. No government affiliation is implied.</p>
        <div>
          <Link to="/map">Map</Link><Link to="/companies">Companies</Link><Link to="/jobs">Jobs</Link>
          <Link to="/internships">Internships</Link><Link to="/insights/states">Insights</Link>
          <Link to="/methodology">Methodology</Link><Link to="/data-status">Data Status</Link><Link to="/coordinate-review">Coordinate Review</Link>
          <Link to="/submit">Submit Data</Link><Link to="/report">Report Data</Link>
          <Link to="/about">About</Link>
          <a href="https://github.com/cko99/mygeomatics-malaysia" target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link to="/disclaimer">Disclaimer</Link><Link to="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
