import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
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
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders category name and description', () => {
    renderComponent('infrastructure');
    expect(screen.getByText('Infrastructure')).toBeDefined();
    expect(screen.getByText(/Cloud VPS, dedicated servers/i)).toBeDefined();
  });

  it('renders clean empty state when no discussions exist', () => {
    renderComponent('infrastructure');
    expect(screen.getByText(/No discussions in this channel yet/i)).toBeDefined();
  });

  it('renders "Category not found" for unknown slug', () => {
    renderComponent('nonexistent');
    expect(screen.getByText(/Category not found/i)).toBeDefined();
  });

  it('renders threads when discussions exist in storage', () => {
    localStorage.setItem(
      'vs_forum_threads_infrastructure',
      JSON.stringify([
        {
          id: 'bgp-peering-setup',
          category: 'infrastructure',
          title: 'Custom BGP peering session on Bare Metal',
          author: 'sysadmin_tim',
          timestamp: '2026-03-01T10:00:00Z',
          replyCount: 3,
          viewCount: 45,
          lastActivity: '2026-03-01T12:00:00Z',
          lastActivityAuthor: 'sysadmin_tim',
          status: 'solved',
        },
      ])
    );

    renderComponent('infrastructure');
    expect(screen.getByText(/Custom BGP peering session/i)).toBeDefined();
    expect(screen.getByText(/sysadmin_tim/)).toBeDefined();
    expect(screen.getByText(/Solved/i)).toBeDefined();
  });
});
