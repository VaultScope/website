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
  it('renders copyright takedown form heading', () => {
    renderComponent();
    expect(screen.getByText('Copyright & Takedown Notice (DSA Art. 16 / UrhG)')).toBeDefined();
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

  it('renders good-faith DSA declaration checkbox', () => {
    renderComponent();
    expect(screen.getByText(/Art\. 16\(2\)\(d\) DSA/)).toBeDefined();
  });

  it('renders Submit Copyright Notice button', () => {
    renderComponent();
    expect(screen.getByText('Submit Copyright Notice')).toBeDefined();
  });

  it('shows success message after submission', () => {
    renderComponent();
    const form = screen.getByText('Submit Copyright Notice').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/Your copyright takedown notice has been prepared/)).toBeDefined();
  });
});
