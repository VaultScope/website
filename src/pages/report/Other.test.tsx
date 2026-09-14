import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ReportOther } from './Other';

function renderComponent() {
  return render(
    <MemoryRouter>
      <ReportOther />
    </MemoryRouter>
  );
}

describe('ReportOther', () => {
  it('renders form heading', () => {
    renderComponent();
    expect(screen.getByText('Report Other Issue')).toBeDefined();
  });

  it('renders email label', () => {
    renderComponent();
    expect(screen.getByText('Your Email')).toBeDefined();
  });

  it('renders subject label', () => {
    renderComponent();
    expect(screen.getByText('Subject')).toBeDefined();
  });

  it('renders description label', () => {
    renderComponent();
    expect(screen.getByText('Description')).toBeDefined();
  });

  it('renders Submit Report button', () => {
    renderComponent();
    expect(screen.getByText('Submit Report')).toBeDefined();
  });

  it('shows success message after submission', () => {
    renderComponent();
    const form = screen.getByText('Submit Report').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/report has been submitted successfully/)).toBeDefined();
  });
});
