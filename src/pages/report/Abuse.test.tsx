import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ReportAbuse } from './Abuse';

function renderComponent() {
  return render(
    <MemoryRouter>
      <ReportAbuse />
    </MemoryRouter>
  );
}

describe('ReportAbuse', () => {
  it('renders report form heading', () => {
    renderComponent();
    expect(screen.getByText('Report Network Abuse')).toBeDefined();
  });

  it('renders email label', () => {
    renderComponent();
    expect(screen.getByText('Your Email')).toBeDefined();
  });

  it('renders IP/URL label', () => {
    renderComponent();
    expect(screen.getByText('Offending IP or URL')).toBeDefined();
  });

  it('renders evidence label', () => {
    renderComponent();
    expect(screen.getByText('Logs or Evidence')).toBeDefined();
  });

  it('renders Submit Report button', () => {
    renderComponent();
    expect(screen.getByText('Submit Report')).toBeDefined();
  });

  it('shows success message after form submission', () => {
    renderComponent();
    const form = screen.getByText('Submit Report').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/abuse report has been submitted/)).toBeDefined();
  });
});
