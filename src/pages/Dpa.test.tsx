import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Dpa } from './Dpa';
import { LanguageProvider } from '../i18n';

describe('Dpa', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Dpa /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Dpa /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Data Processing Agreement');
  });
});
