import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Privacy } from './Privacy';
import { LanguageProvider } from '../i18n';

describe('Privacy', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Privacy /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Privacy /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Privacy');
  });
});
