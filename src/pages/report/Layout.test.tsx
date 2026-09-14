import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ReportLayout } from './Layout';

function renderComponent() {
  return render(
    <MemoryRouter initialEntries={['/report/abuse']}>
      <ReportLayout />
    </MemoryRouter>
  );
}

describe('ReportLayout', () => {
  it('renders the page title', () => {
    renderComponent();
    expect(screen.getByText('Report an Issue')).toBeDefined();
  });

  it('renders the subtitle', () => {
    renderComponent();
    expect(screen.getByText(/Please select the appropriate category/)).toBeDefined();
  });

  it('renders Abuse nav link', () => {
    renderComponent();
    expect(screen.getByText('Abuse')).toBeDefined();
  });

  it('renders DMCA Takedown nav link', () => {
    renderComponent();
    expect(screen.getByText('DMCA Takedown')).toBeDefined();
  });

  it('renders Other Issue nav link', () => {
    renderComponent();
    expect(screen.getByText('Other Issue')).toBeDefined();
  });

  it('links to correct paths', () => {
    renderComponent();
    const abuseLink = screen.getByText('Abuse').closest('a');
    const dmcaLink = screen.getByText('DMCA Takedown').closest('a');
    const otherLink = screen.getByText('Other Issue').closest('a');
    expect(abuseLink?.getAttribute('href')).toBe('/report/abuse');
    expect(dmcaLink?.getAttribute('href')).toBe('/report/dmca');
    expect(otherLink?.getAttribute('href')).toBe('/report/other');
  });
});
