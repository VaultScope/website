import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Cancellation } from './Cancellation';
import { LanguageProvider } from '../i18n';

describe('Cancellation', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LanguageProvider><Cancellation /></LanguageProvider></MemoryRouter>);
    expect(document.body).toBeDefined();
  });

  it('sets document title', () => {
    render(<MemoryRouter><LanguageProvider><Cancellation /></LanguageProvider></MemoryRouter>);
    expect(document.title).toContain('Cancellation');
  });
});
