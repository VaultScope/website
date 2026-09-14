import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ForumThread } from './ForumThread';

function renderComponent(threadId = 'ipv6-config-new-vps') {
  return render(
    <MemoryRouter initialEntries={[`/community/forum/infrastructure/${threadId}`]}>
      <Routes>
        <Route path="/community/forum/:category/:threadId" element={<ForumThread />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ForumThread', () => {
  it('renders thread title', () => {
    renderComponent();
    expect(screen.getByText('IPv6 configuration on new VPS instances')).toBeDefined();
  });

  it('renders posts with author names', () => {
    renderComponent();
    expect(screen.getAllByText(/alex_m/).length).toBeGreaterThan(0);
  });

  it('renders post content', () => {
    renderComponent();
    expect(screen.getByText(/provisioned a new VPS/)).toBeDefined();
  });

  it('renders solved badge when thread is solved', () => {
    renderComponent();
    expect(screen.getByText(/solved/i)).toBeDefined();
  });

  it('renders "Thread not found" for unknown ID', () => {
    renderComponent('nonexistent-thread');
    expect(screen.getByText(/not found|Thread not found/i)).toBeDefined();
  });

  it('renders back link to category', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
