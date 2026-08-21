import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, GitBranch, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getInitialDark, applyDark } from '../hooks/useTheme';

// ─── useTheme ─────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDarkState] = useState<boolean>(() => getInitialDark());

  const setDark = useCallback((next: boolean) => {
    setDarkState(next);
    applyDark(next);
  }, []);

  const toggle = useCallback(() => setDark(!dark), [dark, setDark]);

  // Follow system preference changes when the user hasn't explicitly chosen
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('vs-theme');
      if (!stored) setDark(e.matches);
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [setDark]);

  return { dark, toggle };
}

// ─── Button ──────────────────────────────────────────────────────────────────

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "h-14 px-10 text-sm tracking-wider uppercase font-medium transition-all rounded-none inline-flex items-center justify-center cursor-pointer";
  const variants = {
    primary: "bg-foreground text-background hover:bg-foreground/90 border border-foreground",
    outline: "bg-transparent border border-border text-foreground hover:bg-foreground/5",
    ghost: "bg-transparent text-foreground/50 hover:text-foreground hover:bg-transparent border-transparent"
  };
  return (
    <button className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ─── ThemeToggle ──────────────────────────────────────────────────────────────

const ThemeToggle = () => {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
    >
      {dark
        ? <Sun className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  );
};

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = ({ className = "h-12 w-auto" }: { className?: string }) => (
  <>
    <img
      src="/logos/whitemode-logo.png"
      alt="VaultScope"
      className={`${className} object-contain dark:hidden`}
    />
    <img
      src="/logos/darkmode-logo.png"
      alt="VaultScope"
      className={`${className} object-contain hidden dark:block`}
    />
  </>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Primary desktop nav — hosting first, no /projects
  const navLinks = [
    { label: 'Hosting',     path: '/hosting'     },
    { label: 'Open Source', path: '/open-source' },
    { label: 'Company',     path: '/about'       },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-500 w-full ${scrolled ? 'py-4 bg-background border-b border-border' : 'py-6 bg-transparent'}`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center group">
          <Logo />
        </Link>
      </div>

      {/* Desktop nav links */}
      <div className="hidden lg:flex items-center gap-10 text-xs tracking-wider uppercase font-medium text-foreground/50">
        {navLinks.map(item => (
          <Link
            key={item.label}
            to={item.path}
            className="hover:text-foreground transition-colors py-2 relative group"
          >
            {item.label}
            <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0" />
          </Link>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link to="/contact" className="hidden sm:flex">
          <Button className="h-10 px-8">Contact</Button>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden text-foreground cursor-pointer p-1"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col p-8 border-l border-border md:w-[400px] ml-auto right-0 left-auto">
          <div className="flex justify-between items-center border-b border-border pb-8 mb-8">
            <Logo className="h-9 w-auto" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer p-1 text-foreground/50 hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Hosting */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">Hosting</span>
              <Link to="/hosting" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Cloud VPS</Link>
              <Link to="/hosting" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Dedicated Servers</Link>
              <Link to="/odp"     className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">One-Click Deploy</Link>
            </div>
            {/* Infrastructure */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">Infrastructure</span>
              <Link to="/open-source" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Open Source</Link>
            </div>
            {/* Company */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">Company</span>
              <Link to="/about"       className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">About</Link>
              <Link to="/contact"     className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Contact</Link>
              <Link to="/principles"  className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Principles</Link>
            </div>
            {/* Resources */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">Resources</span>
              <a href="https://pegasusbot.app/docs" target="_blank" rel="noreferrer" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Documentation</a>
              <a href="https://github.com/semi-constructor" target="_blank" rel="noreferrer" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">GitHub</a>
              <a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Status</a>
            </div>
            {/* Legal */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">Legal</span>
              <Link to="/privacy"       className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms"         className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/hosting-terms" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Hosting Terms</Link>
              <Link to="/cancellation"  className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Cancellation Policy</Link>
              <Link to="/aup"           className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Acceptable Use</Link>
              <Link to="/dpa"           className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Data Processing</Link>
              <Link to="/imprint"       className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">Imprint</Link>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-border">
            <Link to="/contact">
              <Button className="w-full">Get in Touch</Button>
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export const Footer = () => (
  <footer className="border-t border-border bg-background pt-24 pb-12 mt-auto px-6">
    <div className="container mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-24">

        {/* Branding */}
        <div className="col-span-2">
          <Link to="/" className="flex items-center mb-8">
            <Logo />
          </Link>
          <p className="text-foreground/40 text-sm max-w-sm leading-relaxed">
            Modern hosting and infrastructure. Cloud VPS and Dedicated Servers — built for what comes next.
          </p>
        </div>

        {/* Hosting */}
        <div>
          <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">Hosting</h3>
          <ul className="space-y-4 text-sm text-foreground/50">
            <li><Link to="/hosting" className="hover:text-foreground transition-colors">Cloud VPS</Link></li>
            <li><Link to="/hosting" className="hover:text-foreground transition-colors">Dedicated Servers</Link></li>
            <li><Link to="/odp"     className="hover:text-foreground transition-colors">One-Click Deploy</Link></li>
          </ul>
        </div>

        {/* Company — /projects ONLY appears here */}
        <div>
          <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">Company</h3>
          <ul className="space-y-4 text-sm text-foreground/50">
            <li><Link to="/open-source" className="hover:text-foreground transition-colors">Open Source</Link></li>
            <li><Link to="/projects"    className="hover:text-foreground transition-colors">Projects</Link></li>
            <li><Link to="/about"       className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/contact"     className="hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">Resources</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><a href="https://pegasusbot.app/docs"                          target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="https://github.com/semi-constructor"                  target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
              <li><a href="https://status.vaultscope.de/status/vs"               target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Status</a></li>
            </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">Legal</h3>
          <ul className="space-y-4 text-sm text-foreground/50">
            <li><Link to="/privacy"        className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms"          className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link to="/hosting-terms"  className="hover:text-foreground transition-colors">Hosting Terms</Link></li>
            <li><Link to="/cancellation"   className="hover:text-foreground transition-colors">Cancellation Policy</Link></li>
            <li><Link to="/aup"            className="hover:text-foreground transition-colors">Acceptable Use</Link></li>
            <li><Link to="/dpa"            className="hover:text-foreground transition-colors">Data Processing</Link></li>
            <li><Link to="/imprint"        className="hover:text-foreground transition-colors">Imprint</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-border pt-8 flex items-center justify-between text-xs tracking-wider uppercase text-foreground/30">
        <div>
          <p>© 2026 VaultScope. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/semi-constructor" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            <GitBranch className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// ─── FeatureSection ───────────────────────────────────────────────────────────
//
// visual provided  → two-column layout (text + visual, reversed when reverse=true)
// no visual        → single wide editorial column, no placeholder box

export const FeatureSection = ({
  title,
  description,
  features,
  reverse,
  index,
  ctaText,
  ctaLink,
  visual,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  features?: { title: string; desc: string }[];
  reverse?: boolean;
  index?: number;
  ctaText?: string;
  ctaLink?: string;
  visual?: React.ReactNode;
}) => {
  const textContent = (
    <div className="flex flex-col space-y-12">
      <div>
        {index !== undefined && (
          <div className="text-foreground/30 text-sm tracking-widest uppercase mb-4">
            0{index + 1} // Platform
          </div>
        )}
        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9]">
          {title}
        </h2>
        {description && (
          <p className="text-xl text-foreground/50 font-light leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>

      {features && features.length > 0 && (
        <div className="flex flex-col gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-2 border-l border-foreground/10 pl-6">
              <h3 className="text-lg font-medium text-foreground tracking-wide uppercase">{f.title}</h3>
              <p className="text-base text-foreground/40 font-light leading-relaxed max-w-md">{f.desc}</p>
            </div>
          ))}
        </div>
      )}

      {ctaText && ctaLink && (
        <div>
          <Link to={ctaLink}>
            <Button variant="outline">{ctaText}</Button>
          </Link>
        </div>
      )}
    </div>
  );

  if (visual) {
    return (
      <section className="py-32 relative bg-background border-t border-border/[0.05] overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className={reverse ? 'lg:order-2' : 'lg:order-1'}>{textContent}</div>
            <div className={reverse ? 'lg:order-1' : 'lg:order-2'}>{visual}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 relative bg-background border-t border-border/[0.05] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">
        {textContent}
      </div>
    </section>
  );
};

// ─── PageHero ─────────────────────────────────────────────────────────────────

export const PageHero = ({
  eyebrow,
  title,
  description,
  primaryCta,
  primaryLink,
  secondaryCta,
  secondaryLink,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryCta?: string;
  primaryLink?: string;
  secondaryCta?: string;
  secondaryLink?: string;
  align?: "center" | "left";
}) => {
  const isExternal = (url?: string) => url?.startsWith('http');
  const isAnchor   = (url?: string) => url?.startsWith('#');

  const renderCta = (label: string, url: string, variant: 'primary' | 'outline') => {
    if (isExternal(url))
      return <a href={url} target="_blank" rel="noreferrer"><Button variant={variant}>{label}</Button></a>;
    if (isAnchor(url))
      return <a href={url}><Button variant={variant}>{label}</Button></a>;
    return <Link to={url}><Button variant={variant}>{label}</Button></Link>;
  };

  return (
    <section className={`relative flex flex-col pt-40 pb-20 bg-background overflow-hidden px-6 ${align === "center" ? "items-center" : "items-start"}`}>
      <div className={`container mx-auto relative z-10 flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"}`}>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}
            className="px-4 py-1.5 border border-border rounded-none text-xs tracking-wider uppercase text-foreground/50 mb-8"
          >
            {eyebrow}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground leading-[0.9] mb-8 max-w-5xl"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.3 }}
            className={`text-xl md:text-2xl text-foreground/50 max-w-2xl tracking-tight font-light mb-12 ${align === "center" ? "mx-auto" : ""}`}
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5 }}
          className={`flex flex-col sm:flex-row gap-6 w-full ${align === "center" ? "justify-center" : "justify-start"}`}
        >
          {primaryCta   && primaryLink   && renderCta(primaryCta,   primaryLink,   'primary')}
          {secondaryCta && secondaryLink && renderCta(secondaryCta, secondaryLink, 'outline')}
        </motion.div>
      </div>
    </section>
  );
};
