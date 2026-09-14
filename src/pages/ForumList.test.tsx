import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ForumList } from './ForumList';

function renderComponent() {
  return render(
    <MemoryRouter>
      <ForumList />
    </MemoryRouter>
  );
}

describe('ForumList', () => {
  it('renders forum categories', () => {
    renderComponent();
    expect(screen.getByText('Infrastructure')).toBeDefined();
    expect(screen.getByText('Operations')).toBeDefined();
  });

  it('renders category descriptions', () => {
    renderComponent();
    expect(screen.getByText(/VPS, dedicated servers/)).toBeDefined();
  });

  it('renders thread and post counts', () => {
    renderComponent();
    expect(screen.getByText(/47/)).toBeDefined();
    expect(screen.getByText(/312/)).toBeDefined();
  });

  it('renders links to category pages', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
