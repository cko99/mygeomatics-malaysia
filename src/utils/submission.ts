export type SubmissionPreview = {
  category: string;
  organization: string;
  source: string;
  details: string;
};

export function createGitHubIssueUrl(mode: 'submit' | 'report', preview: SubmissionPreview) {
  const action = mode === 'submit' ? 'Data proposal' : 'Data correction';
  const params = new URLSearchParams({
    title: `[${action}] ${preview.organization}`,
    body: [
      `### Category\n${preview.category}`,
      `### Organisation or record\n${preview.organization}`,
      `### Public source\n${preview.source || 'Not provided'}`,
      `### Details\n${preview.details}`,
      '### Confirmation\n- [ ] I confirm this submission contains only public, non-sensitive information.',
    ].join('\n\n'),
  });

  return `https://github.com/cko99/mygeomatics-malaysia/issues/new?${params.toString()}`;
}
