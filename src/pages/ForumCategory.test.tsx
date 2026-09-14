import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ForumCategory } from './ForumCategory';

function renderComponent(cat = 'infrastructure') {
  return render(
    <MemoryRouter initialEntries={[`/community/forum/${cat}`]}>
      <Routes>
        <Route path="/community/forum/:category" element={<ForumCategory />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ForumCategory', () => {
  it('renders threads for the infrastructure category', () => {
    renderComponent('infrastructure');
    expect(screen.getByText(/IPv6 configuration on new VPS instances/)).toBeDefined();
  });

  it('renders thread metadata (author, reply count)', () => {
    renderComponent('infrastructure');
    expect(screen.getAllByText(/alex_m/).length).toBeGreaterThan(0);
  });

  it('renders solved status badge', () => {
    renderComponent('infrastructure');
    expect(screen.getByText(/solved/i)).toBeDefined();
  });

  it('renders "Category not found" for unknown slug', () => {
    renderComponent('nonexistent');
    expect(screen.getByText(/not found|No threads/i)).toBeDefined();
  });

  it('renders links to individual threads', () => {
    renderComponent('infrastructure');
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
