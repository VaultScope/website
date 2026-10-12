import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { searchDocs } from './search/docsIndex';
import { HighlightText } from './components/HighlightText';

describe('searchDocs', () => {
  it('returns empty array when query is empty or whitespace', () => {
    expect(searchDocs('')).toEqual([]);
    expect(searchDocs('   ')).toEqual([]);
  });

  it('finds articles matching title or keywords', () => {
    const results = searchDocs('docker');
    expect(results.length).toBeGreaterThan(0);
    const paths = results.map(r => r.article.path);
    expect(paths.some(p => p.includes('storefront') || p.includes('vamos') || p.includes('camos'))).toBe(true);
  });

  it('finds Authentik OIDC guide', () => {
    const results = searchDocs('authentik');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].article.path).toBe('/docs/authentik');
  });

  it('finds specific technical terms in section content like AES-256-GCM', () => {
    const results = searchDocs('AES-256-GCM');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.article.path === '/docs/architecture')).toBe(true);
  });
});

describe('HighlightText', () => {
  it('renders raw text when query is empty', () => {
    const { container } = render(<HighlightText text="Hello VaultScope" query="" />);
    expect(container.textContent).toBe('Hello VaultScope');
    expect(container.querySelector('mark')).toBeNull();
  });

  it('wraps matching words in <mark> tags', () => {
    render(<HighlightText text="VaultScope Storefront documentation" query="storefront" />);
    const mark = screen.getByText('Storefront');
    expect(mark.tagName.toLowerCase()).toBe('mark');
  });

  it('matches case-insensitively and handles multi-word queries', () => {
    const { container } = render(<HighlightText text="PostgreSQL database backup with pg_dump" query="postgresql dump" />);
    const marks = container.querySelectorAll('mark');
    expect(marks.length).toBe(2);
    expect(marks[0].textContent).toBe('PostgreSQL');
    expect(marks[1].textContent).toBe('dump');
  });
});
