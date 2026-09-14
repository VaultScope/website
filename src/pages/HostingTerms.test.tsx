import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HostingTerms } from './HostingTerms';
import { LanguageProvider } from '../i18n';

describe('HostingTerms', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><HostingTerms /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><HostingTerms /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Hosting Terms');
  });
});
