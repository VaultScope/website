import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { searchDocs } from './search/docsIndex';
import { HighlightText } from './components/HighlightText';

describe('searchDocs', () => {
  it('returns empty array when query is empty or whitespace', () => {
    expect(searchDocs('')).toEqual([]);
    expect(searchDocs('   ')).toEqual([]);
  });

  it('finds SFTP articles matching title or keywords', () => {
    const results = searchDocs('sftp');
    expect(results.length).toBeGreaterThan(0);
    const paths = results.map(r => r.article.path);
    expect(paths.some(p => p.includes('/docs/customer/sftp'))).toBe(true);
  });

  it('finds User Login guide', () => {
    const results = searchDocs('login');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.article.path === '/docs/customer/getting-started')).toBe(true);
  });

  it('finds specific technical terms in section content like 2022 or FTHR', () => {
    const results = searchDocs('2022');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.article.path === '/docs/customer/sftp')).toBe(true);
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
