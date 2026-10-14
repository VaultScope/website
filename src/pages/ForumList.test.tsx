import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText('Storage Protocols')).toBeDefined();
    expect(screen.getByText('Operations & SRE')).toBeDefined();
  });

  it('renders category descriptions', () => {
    renderComponent();
    expect(screen.getByText(/dedicated servers/i)).toBeDefined();
    expect(screen.getByText(/Sovereign SFTP/i)).toBeDefined();
  });

  it('filters categories by search query', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search categories/i);
    fireEvent.change(searchInput, { target: { value: 'BGP' } });

    expect(screen.getByText('Networking & Routing')).toBeDefined();
    expect(screen.queryByText('Storage Protocols')).toBeNull();
  });

  it('renders links to category pages', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
