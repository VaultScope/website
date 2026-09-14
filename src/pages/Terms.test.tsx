import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Terms } from './Terms';
import { LanguageProvider } from '../i18n';

describe('Terms', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Terms /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Terms /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Terms');
  });
});
