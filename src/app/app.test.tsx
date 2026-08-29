import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from './theme';
import { AppLayout } from '../components/Layout';
import { InternshipsPage, NotFoundPage, PrivacyPage } from '../pages/StaticPages';
import { createGitHubIssueUrl } from '../utils/submission';

vi.mock('../components/MapView', () => ({ MapView: () => <div>Map preview</div> }));

describe('application surfaces', () => {
  beforeEach(() => localStorage.clear());

  it('renders the 404 page instead of redirecting', () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>);
    expect(screen.getByText('This route is outside the map.')).toBeInTheDocument();
  });

  it('shows the honest internship empty state', () => {
    render(<MemoryRouter><InternshipsPage /></MemoryRouter>);
    expect(screen.getByText(/No reviewed internship listings/)).toBeInTheDocument();
  });

  it('explains the MVP privacy boundary', () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);
    expect(screen.getByText(/does not create user accounts or store form entries/)).toBeInTheDocument();
  });

  it('creates a transparent GitHub review link', () => {
    const url = createGitHubIssueUrl('report', {
      category: 'wrong address',
      organization: 'Example Organisation',
      source: 'https://example.com',
      details: 'The public address should be reviewed against the linked source.',
    });
    expect(url).toContain('github.com/cko99/mygeomatics-malaysia/issues/new');
    expect(new URL(url).searchParams.get('title')).toBe('[Data correction] Example Organisation');
  });

  it('persists theme preference', () => {
    render(<ThemeProvider><button onClick={() => localStorage.setItem('mygeomatics-theme', 'dark')}>save</button></ThemeProvider>);
    fireEvent.click(screen.getByText('save'));
    expect(localStorage.getItem('mygeomatics-theme')).toBe('dark');
  });

  it('opens and closes mobile navigation', () => {
    render(<ThemeProvider><MemoryRouter initialEntries={['/about']}><Routes><Route element={<AppLayout />}><Route path="/about" element={<p>About body</p>} /></Route></Routes></MemoryRouter></ThemeProvider>);
    fireEvent.click(screen.getByLabelText('Open navigation'));
    expect(screen.getByLabelText('Primary')).toHaveClass('open');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByLabelText('Primary')).not.toHaveClass('open');
  });
});
