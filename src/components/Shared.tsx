import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, GitBranch, Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getInitialDark, applyDark } from '../hooks/useTheme';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';

// ─── useTheme ─────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDarkState] = useState<boolean>(() => getInitialDark());

  const setDark = useCallback((next: boolean) => {
    setDarkState(next);
    applyDark(next);
  }, []);

  const toggle = useCallback(() => setDark(!dark), [dark, setDark]);

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
  const { t } = useLanguage();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? t.common.switchToLight : t.common.switchToDark}
      className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
    >
      {dark
        ? <Sun className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  );
};

// ─── LanguageSwitcher ─────────────────────────────────────────────────────────

const LanguageSwitcher = () => {
  const { locale, switchLocale } = useLanguage();

  return (
    <button
      onClick={() => switchLocale(locale === 'en' ? 'de' : 'en')}
      aria-label={`Switch to ${locale === 'en' ? 'Deutsch' : 'English'}`}
      className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer gap-1"
      title={locale === 'en' ? 'Deutsch' : 'English'}
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="text-[10px] font-medium uppercase tracking-wider">{locale === 'en' ? 'DE' : 'EN'}</span>
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

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

export const Breadcrumbs = ({ items }: { items: { label: string; href?: string }[] }) => {
  const { localePath } = useLanguage();
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs tracking-widest uppercase text-foreground/40">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href && i < items.length - 1 ? (
              <Link to={localePath(item.href)} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? 'text-foreground/70' : ''} aria-current={i === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ─── Dropdown Menu Types ──────────────────────────────────────────────────────

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavDropdown {
  label: string;
  id: string;
  items: DropdownItem[];
}

// ─── NavDropdownMenu ──────────────────────────────────────────────────────────

const NavDropdownMenu = ({ dropdown, isOpen, onToggle, onClose }: {
  dropdown: NavDropdown;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { localePath } = useLanguage();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      buttonRef.current?.focus();
      return;
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
        setTimeout(() => itemRefs.current[0]?.focus(), 0);
      }
      return;
    }

    const currentIndex = itemRefs.current.findIndex(ref => ref === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = currentIndex < dropdown.items.length - 1 ? currentIndex + 1 : 0;
      itemRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = currentIndex > 0 ? currentIndex - 1 : dropdown.items.length - 1;
      itemRefs.current[prev]?.focus();
    }
  };

  return (
    <div ref={menuRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={dropdown.id}
        aria-haspopup="true"
        className="flex items-center gap-1 hover:text-foreground transition-colors py-2 relative group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50 cursor-pointer"
      >
        {dropdown.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id={dropdown.id}
          role="menu"
          className="absolute top-full left-0 mt-2 min-w-[200px] border border-border bg-background z-50"
        >
          {dropdown.items.map((item, i) => (
            item.external ? (
              <a
                key={item.href}
                ref={el => { itemRefs.current[i] = el; }}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                tabIndex={-1}
                onClick={onClose}
                className="block px-5 py-3 text-xs tracking-wider uppercase text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] transition-colors focus-visible:outline-none focus-visible:bg-foreground/[0.05]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                ref={el => { itemRefs.current[i] = el; }}
                to={localePath(item.href)}
                role="menuitem"
                tabIndex={-1}
                onClick={onClose}
                className="block px-5 py-3 text-xs tracking-wider uppercase text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] transition-colors focus-visible:outline-none focus-visible:bg-foreground/[0.05]"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const NAV_DROPDOWNS: NavDropdown[] = [
    {
      label: t.nav.infrastructure,
      id: 'nav-infra',
      items: [
        { label: t.nav.cloudVps, href: '/infrastructure/cloud/' },
        { label: t.nav.dedicatedServers, href: '/infrastructure/dedicated/' },
        { label: t.nav.managedInfrastructure, href: '/infrastructure/managed/' },
        { label: t.nav.pricing, href: '/pricing/' },
      ],
    },
    {
      label: t.nav.software,
      id: 'nav-software',
      items: [
        { label: t.nav.pegasus, href: '/software/pegasus/' },
        { label: t.nav.openSource, href: '/company/open-source/' },
      ],
    },
    {
      label: t.nav.company,
      id: 'nav-company',
      items: [
        { label: t.nav.about, href: '/company/about/' },
        { label: t.nav.contact, href: '/company/contact/' },
        { label: t.nav.status, href: 'https://status.vaultscope.de/status/vs', external: true },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false);
        if (openDropdown) setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, openDropdown]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-500 w-full ${scrolled ? 'py-4 bg-background border-b border-border' : 'py-6 bg-transparent'}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center">
        <LocaleLink to="/" className="flex items-center group">
          <Logo />
        </LocaleLink>
      </div>

      {/* Desktop nav links */}
      <div className="hidden lg:flex items-center gap-10 text-xs tracking-wider uppercase font-medium text-foreground/50">
        {NAV_DROPDOWNS.map(dropdown => (
          <NavDropdownMenu
            key={dropdown.id}
            dropdown={dropdown}
            isOpen={openDropdown === dropdown.id}
            onToggle={() => setOpenDropdown(openDropdown === dropdown.id ? null : dropdown.id)}
            onClose={() => setOpenDropdown(null)}
          />
        ))}
        <LocaleLink
          to="/deploy/"
          className="hover:text-foreground transition-colors py-2 relative group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
        >
          {t.nav.deploy}
          <span className="absolute bottom-0 left-1/2 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0" />
        </LocaleLink>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <LocaleLink to="/company/contact/" className="hidden sm:flex">
          <Button className="h-10 px-8">{t.common.contact}</Button>
        </LocaleLink>
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden text-foreground cursor-pointer p-1"
          aria-label={t.common.openMenu}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background z-50 flex flex-col p-8 border-l border-border md:w-[400px] ml-auto right-0 left-auto overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex justify-between items-center border-b border-border pb-8 mb-8">
            <Logo className="h-9 w-auto" />
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer p-1 text-foreground/50 hover:text-foreground transition-colors"
                aria-label={t.common.closeMenu}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{t.nav.infrastructure}</span>
              <LocaleLink to="/infrastructure/cloud/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.cloudVps}</LocaleLink>
              <LocaleLink to="/infrastructure/dedicated/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.dedicatedServers}</LocaleLink>
              <LocaleLink to="/infrastructure/managed/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.managedInfrastructure}</LocaleLink>
              <LocaleLink to="/pricing/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.pricing}</LocaleLink>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{t.nav.deploy}</span>
              <LocaleLink to="/deploy/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.oneClickDeploy}</LocaleLink>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{t.nav.software}</span>
              <LocaleLink to="/software/pegasus/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.pegasus}</LocaleLink>
              <LocaleLink to="/company/open-source/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.openSource}</LocaleLink>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{t.nav.company}</span>
              <LocaleLink to="/company/about/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.about}</LocaleLink>
              <LocaleLink to="/company/contact/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.contact}</LocaleLink>
              <a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.status}</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{t.nav.resources}</span>
              <a href="https://pegasusbot.app/docs" target="_blank" rel="noreferrer" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.documentation}</a>
              <a href="https://github.com/semi-constructor" target="_blank" rel="noreferrer" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">GitHub</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium text-foreground/30 uppercase tracking-widest">{t.nav.legal}</span>
              <LocaleLink to="/legal/privacy/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.privacyPolicy}</LocaleLink>
              <LocaleLink to="/legal/terms/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.termsOfService}</LocaleLink>
              <LocaleLink to="/legal/hosting-terms/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.hostingTerms}</LocaleLink>
              <LocaleLink to="/legal/imprint/" className="text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground transition-colors">{t.nav.imprint}</LocaleLink>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-border">
            <LocaleLink to="/company/contact/">
              <Button className="w-full">{t.common.getInTouch}</Button>
            </LocaleLink>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export const Footer = () => {
  const { t, localePath } = useLanguage();

  return (
    <footer className="border-t border-border bg-background pt-24 pb-12 mt-auto px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-24">

          <div className="col-span-2">
            <LocaleLink to="/" className="flex items-center mb-8">
              <Logo />
            </LocaleLink>
            <p className="text-foreground/40 text-sm max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t.nav.infrastructure}</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><Link to={localePath('/infrastructure/cloud/')} className="hover:text-foreground transition-colors">{t.nav.cloudVps}</Link></li>
              <li><Link to={localePath('/infrastructure/dedicated/')} className="hover:text-foreground transition-colors">{t.nav.dedicatedServers}</Link></li>
              <li><Link to={localePath('/deploy/')} className="hover:text-foreground transition-colors">{t.nav.oneClickDeploy}</Link></li>
              <li><Link to={localePath('/infrastructure/managed/')} className="hover:text-foreground transition-colors">{t.footer.managed}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t.nav.company}</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><Link to={localePath('/company/open-source/')} className="hover:text-foreground transition-colors">{t.nav.openSource}</Link></li>
              <li><Link to={localePath('/company/about/')} className="hover:text-foreground transition-colors">{t.nav.about}</Link></li>
              <li><Link to={localePath('/company/contact/')} className="hover:text-foreground transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t.nav.resources}</h3>
              <ul className="space-y-4 text-sm text-foreground/50">
                <li><a href="https://pegasusbot.app/docs" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">{t.nav.documentation}</a></li>
                <li><a href="https://github.com/semi-constructor" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="https://status.vaultscope.de/status/vs" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">{t.nav.status}</a></li>
              </ul>
          </div>

          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase text-foreground/30 mb-8">{t.nav.legal}</h3>
            <ul className="space-y-4 text-sm text-foreground/50">
              <li><Link to={localePath('/legal/privacy/')} className="hover:text-foreground transition-colors">{t.nav.privacyPolicy}</Link></li>
              <li><Link to={localePath('/legal/terms/')} className="hover:text-foreground transition-colors">{t.nav.termsOfService}</Link></li>
              <li><Link to={localePath('/legal/hosting-terms/')} className="hover:text-foreground transition-colors">{t.nav.hostingTerms}</Link></li>
              <li><Link to={localePath('/legal/cancellation/')} className="hover:text-foreground transition-colors">{t.nav.cancellationPolicy}</Link></li>
              <li><Link to={localePath('/legal/aup/')} className="hover:text-foreground transition-colors">{t.nav.acceptableUse}</Link></li>
              <li><Link to={localePath('/legal/dpa/')} className="hover:text-foreground transition-colors">{t.nav.dataProcessing}</Link></li>
              <li><Link to={localePath('/legal/imprint/')} className="hover:text-foreground transition-colors">{t.nav.imprint}</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex items-center justify-between text-xs tracking-wider uppercase text-foreground/30">
          <div>
            <p>{t.footer.copyright}</p>
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
};

// ─── FeatureSection ───────────────────────────────────────────────────────────

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
  const { localePath } = useLanguage();

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
          <Link to={localePath(ctaLink)}>
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
  const { localePath } = useLanguage();
  const isExternal = (url?: string) => url?.startsWith('http');
  const isAnchor   = (url?: string) => url?.startsWith('#');

  const renderCta = (label: string, url: string, variant: 'primary' | 'outline') => {
    if (isExternal(url))
      return <a href={url} target="_blank" rel="noreferrer"><Button variant={variant}>{label}</Button></a>;
    if (isAnchor(url))
      return <a href={url}><Button variant={variant}>{label}</Button></a>;
    return <Link to={localePath(url)}><Button variant={variant}>{label}</Button></Link>;
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
