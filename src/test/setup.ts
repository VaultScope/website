import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const handler: ProxyHandler<Record<string, any>> = {
    get(_target, prop: string) {
      return React.forwardRef(({ children, ...props }: any, ref: any) => {
        return React.createElement(prop as string, { ref }, children);
      });
    },
  };
  const motion = new Proxy({}, handler);

  return {
    motion,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useInView: () => true,
    AnimatePresence: ({ children }: any) => children,
    useMotionValue: (v: number) => ({ get: () => v, set: () => {} }),
    useSpring: (v: any) => v,
    useAnimation: () => ({ start: () => Promise.resolve(), stop: () => {} }),
  };
});

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: any) => children,
  HelmetProvider: ({ children }: any) => children,
}));
