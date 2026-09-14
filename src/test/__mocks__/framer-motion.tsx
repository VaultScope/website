import type { ReactNode } from 'react';

const handler = {
  get(_target: any, prop: string) {
    return ({ children, ...props }: { children?: ReactNode; [key: string]: any }) => {
      const Tag = prop as any;
      const safe: Record<string, any> = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v !== 'function' && typeof v !== 'object' && k !== 'initial' && k !== 'animate' && k !== 'exit' && k !== 'transition' && k !== 'whileInView' && k !== 'viewport') {
          safe[k] = v;
        }
      }
      return <Tag {...safe}>{children}</Tag>;
    };
  },
};

export const motion = new Proxy({}, handler);
export const useScroll = () => ({ scrollYProgress: { get: () => 0 } });
export const useTransform = (_: any, __: any, ___?: any) => 0;
export const useInView = () => true;
export const AnimatePresence = ({ children }: { children?: ReactNode }) => <>{children}</>;
export const useMotionValue = (v: number) => ({ get: () => v, set: () => {} });
export const useSpring = (v: any) => v;
