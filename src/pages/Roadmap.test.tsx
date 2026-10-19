import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../i18n';
import { Navbar } from '../components/Shared';
import { Roadmap, ROADMAP_QUARTERS } from './Roadmap';

describe('Roadmap Page & Navigation', () => {
  it('renders all 4 roadmap quarters and all 44 checklist milestones with exact completion states', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/company/roadmap']}>
          <LanguageProvider>
            <Roadmap />
          </LanguageProvider>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(ROADMAP_QUARTERS).toHaveLength(4);
    expect(screen.getByText(/Q4 2026 — Foundation & Launch/i)).toBeInTheDocument();
    expect(screen.getByText(/Q1 2027 — Expansion & Ecosystem/i)).toBeInTheDocument();
    expect(screen.getByText(/Q2 2027 — Automation & Growth/i)).toBeInTheDocument();
    expect(screen.getByText(/Q3 2027 — Maturity & Scale/i)).toBeInTheDocument();

    const completedItems = screen.getAllByTestId('roadmap-item-completed');
    const plannedItems = screen.getAllByTestId('roadmap-item-planned');

    expect(completedItems).toHaveLength(7);
    expect(plannedItems).toHaveLength(37);

    expect(screen.getByText('Launch VaultScope')).toBeInTheDocument();
    expect(screen.getByText('Launch SFTP Storage')).toBeInTheDocument();
    expect(screen.getByText('Launch Cloud VPS hosting')).toBeInTheDocument();
    expect(screen.getByText('Public release of the VaultScope iOS app')).toBeInTheDocument();
    expect(screen.getByText('Introduce automated backups for supported services')).toBeInTheDocument();
    expect(
      screen.getByText('Evaluate international expansion and additional infrastructure locations')
    ).toBeInTheDocument();
  });

  it('includes Roadmap in the Company dropdown menu', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LanguageProvider>
          <Navbar />
        </LanguageProvider>
      </MemoryRouter>
    );

    const companyTrigger = screen.getByRole('button', { name: /Company/i });
    fireEvent.click(companyTrigger);

    const roadmapLink = screen.getByRole('menuitem', { name: /Roadmap/i });
    expect(roadmapLink).toBeInTheDocument();
    expect(roadmapLink).toHaveAttribute('href', '/company/roadmap/');
  });
});
