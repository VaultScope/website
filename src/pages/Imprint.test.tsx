import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Imprint } from './Imprint';
import { LanguageProvider } from '../i18n';

describe('Imprint', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Imprint /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Imprint /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Imprint');
  });
});
