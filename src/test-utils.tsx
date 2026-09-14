import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

export function createI18nMock() {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === Symbol.toPrimitive || prop === 'toString' || prop === 'valueOf') {
        return () => 'mock-text';
      }
      if (typeof prop === 'string') {
        return new Proxy({}, handler);
      }
      return undefined;
    },
  };

  return {
    useLanguage: () => ({
      locale: 'en',
      t: new Proxy({}, handler),
      localePath: (p: string) => p,
      switchLocale: vi.fn(),
      stripLocale: (p: string) => p,
    }),
    LanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
}

export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}
