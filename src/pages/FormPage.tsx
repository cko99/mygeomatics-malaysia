import { Check, ExternalLink, Eye, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { createGitHubIssueUrl, type SubmissionPreview } from '../utils/submission';

const submitCategories = [
  'new company', 'government agency', 'university', 'research centre',
  'equipment vendor', 'branch office', 'website', 'LinkedIn', 'Facebook',
  'phone', 'general email', 'HR email', 'career email', 'internship contact',
  'service', 'subfield', 'software evidence', 'job', 'internship',
  'company logo', 'inactive company status',
];

const reportCategories = [
  'duplicate organisation', 'company closed', 'branch moved', 'wrong address',
  'wrong map location', 'broken website', 'wrong email', 'wrong phone',
  'wrong LinkedIn', 'wrong sector', 'wrong software', 'wrong description',
  'wrong logo', 'expired job', 'broken job URL', 'expired internship',
  'incorrect salary', 'unavailable source', 'other correction',
];

export function FormPage({ mode }: { mode: 'submit' | 'report' }) {
  const [preview, setPreview] = useState<SubmissionPreview | null>(null);
  const categories = mode === 'submit' ? submitCategories : reportCategories;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPreview({
      category: String(data.get('category')),
      organization: String(data.get('organization')),
      source: String(data.get('source')),
      details: String(data.get('details')),
    });
  };

  return (
    <div className="form-layout">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Community review via GitHub</p>
          <h2>{mode === 'submit' ? 'Propose public data' : 'Report incorrect data'}.</h2>
          <p>
            Preview the information here, then continue to GitHub to submit it for
            a transparent, moderated review. Nothing is transmitted until you click
            the GitHub button.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <label>
          Category
          <select name="category" required defaultValue="">
            <option value="" disabled>Select a category</option>
            {categories.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          Organisation or record
          <input name="organization" required maxLength={160} />
        </label>
        <label>
          Public source URL
          <input name="source" type="url" placeholder="https://" maxLength={500} />
        </label>
        <label>
          Details
          <textarea name="details" required minLength={20} maxLength={2000} rows={6} />
        </label>
        <button className="button primary" type="submit"><Eye />Preview submission</button>
      </form>

      {preview && (
        <aside className="form-preview" aria-live="polite">
          <div><Check /><span>Local validation passed</span></div>
          <h3>{preview.category}</h3>
          <p><strong>Record:</strong> {preview.organization}</p>
          <p><strong>Source:</strong> {preview.source || 'Not provided'}</p>
          <p>{preview.details}</p>
          <a
            className="button primary"
            href={createGitHubIssueUrl(mode, preview)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue securely on GitHub <ExternalLink />
          </a>
          <p className="muted"><ShieldCheck /> Do not submit personal or confidential information.</p>
        </aside>
      )}
    </div>
  );
}
