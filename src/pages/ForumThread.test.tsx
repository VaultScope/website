import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ForumThread } from './ForumThread';

const testThread = {
  id: 'bgp-peering-setup',
  title: 'Custom BGP peering session on Bare Metal',
  category: 'infrastructure',
  status: 'solved',
  posts: [
    {
      id: '1',
      author: 'sysadmin_tim',
      timestamp: '2026-03-01T10:00:00Z',
      isOriginalPost: true,
      content: 'Configuring BGP peering with AS65001 upstream.',
    },
    {
      id: '2',
      author: 'noc_engineer',
      timestamp: '2026-03-01T11:00:00Z',
      isSolution: true,
      content: 'Make sure your prefix filter allows the /48 announcement.',
    },
  ],
};

function renderComponent(threadId = 'bgp-peering-setup') {
  return render(
    <MemoryRouter initialEntries={[`/resources/forum/infrastructure/${threadId}`]}>
      <Routes>
        <Route path="/resources/forum/:category/:threadId" element={<ForumThread />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ForumThread', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(`vs_thread_${testThread.id}`, JSON.stringify(testThread));
  });

  it('renders thread title', () => {
    renderComponent();
    expect(screen.getByText('Custom BGP peering session on Bare Metal')).toBeDefined();
  });

  it('renders posts with author names', () => {
    renderComponent();
    expect(screen.getByText('sysadmin_tim')).toBeDefined();
    expect(screen.getByText('noc_engineer')).toBeDefined();
  });

  it('renders post content', () => {
    renderComponent();
    expect(screen.getByText(/Configuring BGP peering/i)).toBeDefined();
    expect(screen.getByText(/prefix filter/i)).toBeDefined();
  });

  it('renders solved badge when thread is solved', () => {
    renderComponent();
    expect(screen.getByText(/Solved/i)).toBeDefined();
  });

  it('renders "Discussion not found" for unknown ID', () => {
    renderComponent('nonexistent-thread');
    expect(screen.getByText(/Discussion not found/i)).toBeDefined();
  });

  it('renders back link to category', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
