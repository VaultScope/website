import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocsCamos } from './Camos';

describe('DocsCamos', () => {
  it('renders heading', () => {
    render(<MemoryRouter><DocsCamos /></MemoryRouter>);
    expect(screen.getByText('CAMOS (Admin Panel)')).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><DocsCamos /></MemoryRouter>);
    expect(document.title).toBe('CAMOS Documentation — VaultScope');
  });

  it('describes CAMOS purpose', () => {
    render(<MemoryRouter><DocsCamos /></MemoryRouter>);
    expect(screen.getByText(/internal control plane/)).toBeDefined();
  });

  it('mentions product management', () => {
    render(<MemoryRouter><DocsCamos /></MemoryRouter>);
    expect(screen.getByText(/Product & Catalog Management/)).toBeDefined();
  });
});
