import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Aup } from './Aup';
import { LanguageProvider } from '../i18n';

describe('Aup', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Aup /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Aup /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Acceptable Use');
  });
});
