import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ReportDmca } from './Dmca';

function renderComponent() {
  return render(
    <MemoryRouter>
      <ReportDmca />
    </MemoryRouter>
  );
}

describe('ReportDmca', () => {
  it('renders DMCA form heading', () => {
    renderComponent();
    expect(screen.getByText('DMCA Takedown Notice')).toBeDefined();
  });

  it('renders name/company label', () => {
    renderComponent();
    expect(screen.getByText('Your Full Name / Company')).toBeDefined();
  });

  it('renders email label', () => {
    renderComponent();
    expect(screen.getByText('Your Email')).toBeDefined();
  });

  it('renders infringing URLs label', () => {
    renderComponent();
    expect(screen.getByText('Infringing URL(s)')).toBeDefined();
  });

  it('renders original work label', () => {
    renderComponent();
    expect(screen.getByText('Original Work URL(s) or Evidence')).toBeDefined();
  });

  it('renders perjury checkbox', () => {
    renderComponent();
    expect(screen.getByText(/penalty of perjury/)).toBeDefined();
  });

  it('renders Submit DMCA Notice button', () => {
    renderComponent();
    expect(screen.getByText('Submit DMCA Notice')).toBeDefined();
  });

  it('shows success message after submission', () => {
    renderComponent();
    const form = screen.getByText('Submit DMCA Notice').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/DMCA takedown request has been submitted/)).toBeDefined();
  });
});
