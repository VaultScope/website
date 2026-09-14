import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Principles } from './Principles';
import { LanguageProvider } from '../i18n';

describe('Principles', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Principles /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Principles /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Our Principles');
  });
});
