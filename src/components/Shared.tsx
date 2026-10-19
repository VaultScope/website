import { twMerge } from 'tailwind-merge';
import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import {
  Menu,
  X,
  GitBranch,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Check,
  Globe,
  MessageSquare,
  User,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  LogOut,
  ArrowUpRight,
  Plus,
  Layers,
  Server,
  HardDrive,
  FolderLock,
  ShieldCheck,
  Cpu,
  BookOpen,
  FileText,
  Activity,
  Building2,
  Users,
  Mail,
  ShieldAlert,
  Handshake,
  Milestone,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getInitialDark, applyDark } from '../hooks/useTheme';
import { useLanguage } from '../i18n';
import { LocaleLink } from '../i18n/LocaleLink';
import { getStoredClaims, logout } from '../lib/auth';
import { api } from '../lib/api';

// ─── Highlight Parser (Strips legacy * markers for uniform display type) ───

export const parseHighlight = (text: React.ReactNode): React.ReactNode => {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <Fragment key={i}>{part.slice(1, -1)}</Fragment>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
};

// ─── useTheme ─────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDarkState] = useState<boolean>(() => getInitialDark());

  const setDark = useCallback((next: boolean) => {
    setDarkState(next);
    applyDark(next);
  }, []);

  const toggle = useCallback(() => setDark(!dark), [dark, setDark]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  }, [dark]);

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

// ─── ReticleRail (No-op export preserved for backward compatibility) ──────────

export interface ReticleRailProps {
  mode?: 'brand' | 'commerce' | 'operational';
}

export const ReticleRail: React.FC<ReticleRailProps> = () => null;

// ─── Button (Authentic VaultScope Purple Primary & Architectural Secondary) ───

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base =
    'h-10 px-5 text-[13.5px] font-sans font-medium tracking-[-0.01em] transition-all duration-200 ease-out rounded-[6px] inline-flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'vs-btn-primary font-semibold',
    outline: 'vs-btn-secondary',
    ghost:
      'bg-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]/70 border border-transparent',
    dynamic: 'vs-btn-secondary',
  };
  return (
    <button
      className={twMerge(base, variants[variant as keyof typeof variants] || variants.primary, className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── StatusChip (Strictly for real operational states) ────────────────────────

export const StatusChip = ({
  status = 'ok',
  label,
  className = '',
}: {
  status?: 'ok' | 'warn' | 'err' | 'neutral';
  label: string;
  className?: string;
}) => {
  const dotColors = {
    ok: 'bg-[var(--ok)]',
    warn: 'bg-[var(--warn)]',
    err: 'bg-[var(--err)]',
    neutral: 'bg-[var(--fg-muted)]',
  };
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-[5px] border border-[var(--line)] bg-[var(--bg-elevated)]/80 font-mono text-[11px] text-[var(--fg)] leading-none',
        className
      )}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[status]}`} />
      <span>{label}</span>
    </span>
  );
};

// ─── RuledTable (Open Horizontal-Hairline Architectural Ledger) ───────────────

export const RuledTable = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const childArray = React.Children.toArray(children);
  const hasWrapper =
    childArray.length === 1 &&
    React.isValidElement(childArray[0]) &&
    (childArray[0].type === 'table' || childArray[0].type === 'div');

  return (
    <div
      className={twMerge(
        'w-full bg-transparent overflow-x-auto',
        className
      )}
    >
      {hasWrapper ? (
        children
      ) : (
        <table className="vs-table w-full min-w-[520px] sm:min-w-full text-left border-collapse">{children}</table>
      )}
    </div>
  );
};

// ─── ThemeToggle ──────────────────────────────────────────────────────────────

const ThemeToggle = () => {
  const { dark, toggle } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.common.switchToLight : t.common.switchToDark}
      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--line)] transition-all duration-150 cursor-pointer shrink-0"
    >
      {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
};

// ─── LanguageSwitcher ─────────────────────────────────────────────────────────

const LanguageSwitcher = () => {
  const { locale, switchLocale } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => switchLocale(locale === 'en' ? 'de' : 'en')}
      aria-label={`Switch to ${locale === 'en' ? 'Deutsch' : 'English'}`}
      className="h-8 px-2.5 rounded-lg inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] border border-transparent hover:border-[var(--line)] transition-all duration-150 cursor-pointer gap-1.5 font-mono text-[11px] font-medium shrink-0"
      title={locale === 'en' ? 'Deutsch' : 'English'}
    >
      <Globe className="w-3.5 h-3.5 shrink-0" />
      <span>{locale === 'en' ? 'DE' : 'EN'}</span>
    </button>
  );
};

// ─── Logo (Real VaultScope Brand Crest + Typographic Wordmark) ────────────────

export const Logo = ({ className = 'h-8 w-auto' }: { className?: string }) => (
  <span className={twMerge('inline-flex items-center gap-2.5 select-none shrink-0', className)}>
    <img
      src="/logos/logo-picture.png"
      alt="VaultScope"
      className="h-[22px] w-auto hidden dark:block object-contain shrink-0"
    />
    <img
      src="/logos/logo-picture-whitemode.png"
      alt="VaultScope"
      className="h-[22px] w-auto block dark:hidden object-contain shrink-0"
    />
    <span className="font-sans font-semibold text-[15px] tracking-[-0.022em] text-[var(--fg)] leading-none">
      VaultScope
    </span>
  </span>
);

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

export type BreadcrumbItem = string | { label: string; href?: string; path?: string };

export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  const { localePath } = useLanguage();
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-2 font-sans text-xs text-[var(--fg-muted)]">
        {items.map((raw, i) => {
          const item =
            typeof raw === 'string'
              ? { label: raw }
              : { label: raw.label, href: raw.href || raw.path };
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-[var(--fg-faint)]">
                  /
                </span>
              )}
              {item.href && i < items.length - 1 ? (
                <Link
                  to={localePath(item.href)}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={i === items.length - 1 ? 'text-[var(--fg)] font-medium' : ''}
                  aria-current={i === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ─── CustomSelect (Architectural Select Dropdown) ─────────────────────────────

export interface CustomSelectOption {
  value: string;
  label: string;
  description?: string;
  hint?: string;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  autoComplete,
  className = '',
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Synchronized native select for accessibility, browser autofill, and tests */}
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Architectural Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={twMerge(
          'w-full flex items-center justify-between gap-2 rounded-[6px] bg-[var(--bg-subtle)] hover:border-[var(--line-strong)] border border-[var(--line)] px-3.5 py-2.5 text-sm text-left text-[var(--fg)] transition-all duration-150 cursor-pointer focus:outline-none focus:border-[var(--accent-bright)] focus:ring-1 focus:ring-[var(--accent-bright)]/40 disabled:opacity-50',
          open && 'border-[var(--line-strong)] ring-1 ring-[var(--accent-bright)]/30',
          className
        )}
      >
        <span className={selectedOption ? 'text-[var(--fg)] truncate font-medium' : 'text-[var(--fg-faint)] truncate'}>
          {selectedOption ? selectedOption.label : placeholder || 'Select...'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--fg-muted)] shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180 text-[var(--accent-bright)]' : ''
          }`}
        />
      </button>

      {/* Floating Listbox */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl vs-dropdown-panel animate-vs-dropdown p-1.5 max-h-64 overflow-y-auto"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const sublabel = opt.description || opt.hint;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-subtle)] text-[var(--fg)] font-semibold'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate">{opt.label}</div>
                  {sublabel && (
                    <div className="text-[11px] text-[var(--fg-faint)] truncate mt-0.5 font-normal">
                      {sublabel}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[var(--accent-bright)] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Atmospheric Obsidian Navigation Bar ──────────────────────────────────────

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

interface NavDropdown {
  label: string;
  id: string;
  matchPrefixes: string[];
  items: DropdownItem[];
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const { t, locale, localePath, stripLocale } = useLanguage();
  const currentPath = stripLocale(location.pathname);
  const isDashboardEndpoint = currentPath.startsWith('/dashboard');

  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const claims = getStoredClaims();
    if (!claims) return null;
    const storedName = localStorage.getItem('vs_user_name');
    return {
      name: storedName || claims.email.split('@')[0],
      email: claims.email,
    };
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDe = locale === 'de';

  const NAV_DROPDOWNS: NavDropdown[] = [
    {
      label: 'Hosting',
      id: 'nav-hosting',
      matchPrefixes: ['/infrastructure', '/deploy'],
      items: [
        {
          label: isDe ? 'Übersicht' : 'Overview',
          href: '/infrastructure/',
          icon: Layers,
        },
        {
          label: 'OCD',
          href: '/deploy/',
          icon: Cpu,
        },
        {
          label: 'VPS',
          href: '/infrastructure/cloud/',
          icon: Server,
        },
        {
          label: 'Dedicated Server',
          href: '/infrastructure/dedicated/',
          icon: HardDrive,
        },
        {
          label: 'Storage',
          href: '/infrastructure/storage/',
          icon: FolderLock,
        },
        {
          label: 'Managed',
          href: '/infrastructure/managed/',
          icon: ShieldCheck,
        },
      ],
    },
    {
      label: t.nav.resources || 'Resources',
      id: 'nav-resources',
      matchPrefixes: ['/resources', '/docs', '/report', '/blog', '/forum'],
      items: [
        {
          label: t.nav.documentation || 'Documentation',
          href: '/docs',
          icon: BookOpen,
        },
        {
          label: 'Blog',
          href: '/resources/blog/',
          icon: FileText,
        },
        {
          label: 'Forum',
          href: '/resources/forum/',
          icon: MessageSquare,
        },
        {
          label: 'Report',
          href: '/report/',
          icon: ShieldAlert,
        },
        {
          label: t.nav.status || 'Status',
          href: 'https://status.vaultscope.de/status/vs',
          icon: Activity,
          external: true,
        },
      ],
    },
    {
      label: t.nav.company || 'Company',
      id: 'nav-company',
      matchPrefixes: ['/company', '/partners', '/roadmap'],
      items: [
        {
          label: t.nav.about || 'About',
          href: '/company/about/',
          icon: Building2,
        },
        {
          label: 'Team',
          href: '/company/team/',
          icon: Users,
        },
        {
          label: 'Roadmap',
          href: '/company/roadmap/',
          icon: Milestone,
        },
        {
          label: t.nav.contact || 'Contact',
          href: '/company/contact/',
          icon: Mail,
        },
        {
          label: t.nav.openSource || 'Open Source',
          href: '/company/open-source/',
          icon: GitBranch,
        },
        {
          label: isDe ? 'Partner' : 'Partners',
          href: '/company/partners/',
          icon: Handshake,
        },
      ],
    },
  ];

  const clearCloseTimer = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 140);
  }, [clearCloseTimer]);

  const handleOpenDropdown = useCallback(
    (id: string) => {
      clearCloseTimer();
      setOpenDropdown(id);
    },
    [clearCloseTimer]
  );

  useEffect(() => {
    const claims = getStoredClaims();
    if (claims) {
      const storedName = localStorage.getItem('vs_user_name');
      if (storedName) {
        setUser({ name: storedName, email: claims.email });
      } else {
        setUser({ name: claims.email.split('@')[0], email: claims.email });
        api
          .get<{ name?: string; email?: string }>('/storefront/profile')
          .then((profile) => {
            if (profile.name) {
              localStorage.setItem('vs_user_name', profile.name);
              setUser({ name: profile.name, email: profile.email || claims.email });
            }
          })
          .catch(() => {});
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
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
        if (userMenuOpen) setUserMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, openDropdown, userMenuOpen]);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      aria-label="Main navigation"
    >
      <div className="h-16 bg-[var(--bg)]/92 backdrop-blur-xl border-b border-[var(--line)]">
        <div className="vs-container h-full flex items-center justify-between gap-4">
          {/* Left: Real Brand Logo (redirects to / or /dashboard based on active endpoint) + Primary Navigation */}
          <div className="flex items-center gap-6 xl:gap-8 h-full min-w-0">
            <LocaleLink
              to={isDashboardEndpoint ? '/dashboard' : '/'}
              className="flex items-center group focus-visible:outline-none shrink-0"
            >
              <Logo />
            </LocaleLink>

            <nav className="hidden lg:flex items-center gap-1 h-full" aria-label="Primary">
              {NAV_DROPDOWNS.map((dropdown) => {
                const isMenuOpen = openDropdown === dropdown.id;
                const isRouteActive = dropdown.matchPrefixes.some((p) => currentPath.startsWith(p));
                return (
                  <div
                    key={dropdown.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleOpenDropdown(dropdown.id)}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isMenuOpen ? null : dropdown.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' && !isMenuOpen) {
                          e.preventDefault();
                          setOpenDropdown(dropdown.id);
                        }
                      }}
                      aria-expanded={isMenuOpen}
                      aria-controls={dropdown.id}
                      aria-haspopup="true"
                      className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-[13px] font-sans font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-150 cursor-pointer relative ${
                        isMenuOpen
                          ? 'text-[var(--fg)] bg-[var(--bg-subtle)]'
                          : isRouteActive
                            ? 'text-[var(--fg)] bg-[var(--bg-elevated)]'
                            : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <span>{dropdown.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                          isMenuOpen ? 'rotate-180 text-[var(--accent-bright)]' : 'text-[var(--fg-faint)]'
                        }`}
                      />
                    </button>

                    {(isMenuOpen || isRouteActive) && (
                      <span className="pointer-events-none absolute bottom-0 inset-x-3 h-[2px] bg-[var(--accent-bright)]" />
                    )}

                    {isMenuOpen && (
                      <div
                        id={dropdown.id}
                        role="menu"
                        onMouseEnter={clearCloseTimer}
                        onMouseLeave={scheduleClose}
                        className="absolute top-full left-0 pt-2 z-50 w-[224px]"
                      >
                        <div className="vs-dropdown-panel animate-vs-dropdown p-1.5 relative overflow-hidden flex flex-col gap-0.5">
                          {dropdown.items.map((item) => {
                            const Icon = item.icon;
                            const activeItem =
                              !item.external &&
                              currentPath === item.href.replace(/\/$/, '') &&
                              item.href !== '/';
                            const content = (
                              <div
                                className={`group px-3 py-2 rounded-lg flex items-center justify-between gap-2.5 transition-colors duration-150 ${
                                  activeItem
                                    ? 'bg-[var(--accent-subtle)] text-[var(--fg)]'
                                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Icon
                                    className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                                      activeItem
                                        ? 'text-[var(--accent-bright)]'
                                        : 'text-[var(--fg-muted)] group-hover:text-[var(--accent-bright)]'
                                    }`}
                                  />
                                  <span
                                    className={`text-[13px] font-sans font-medium tracking-[-0.01em] transition-colors truncate ${
                                      activeItem
                                        ? 'text-[var(--fg)]'
                                        : 'text-[var(--fg)] group-hover:text-[var(--accent-bright)]'
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                </div>
                                {item.external ? (
                                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--fg-faint)] group-hover:text-[var(--accent-bright)] transition-colors shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-bright)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shrink-0" />
                                )}
                              </div>
                            );

                            return item.external ? (
                              <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="block rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-bright)]"
                              >
                                {content}
                              </a>
                            ) : (
                              <Link
                                key={item.href}
                                to={localePath(item.href)}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="block rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-bright)]"
                              >
                                {content}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: Locale, Theme, Auth — Unified 32px (h-8) Control Grid */}
          <div className="flex items-center gap-1.5 shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />

            <div className="hidden sm:block h-4 w-px bg-[var(--line)] mx-1" />

            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 h-8 px-2.5 rounded-lg border text-xs font-medium transition-colors duration-150 cursor-pointer ${
                    userMenuOpen
                      ? 'border-[var(--line-strong)] bg-[var(--bg-subtle)] text-[var(--fg)]'
                      : 'border-[var(--line)] bg-[var(--bg-elevated)] hover:border-[var(--line-strong)] hover:bg-[var(--bg-subtle)] text-[var(--fg)]'
                  }`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-3.5 h-3.5 text-[var(--accent-bright)] shrink-0" />
                  <span className="max-w-[115px] truncate font-mono text-[11.5px]">{user.name}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-[var(--fg-muted)] shrink-0 transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180 text-[var(--accent-bright)]' : ''
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 vs-dropdown-panel animate-vs-dropdown p-1.5 z-50 overflow-hidden"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-[var(--line)] mb-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--fg)] truncate">{user.name}</p>
                      <p className="text-[11px] font-mono text-[var(--fg-muted)] truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <LocaleLink
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="group/uitem flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[var(--fg-muted)] group-hover/uitem:text-[var(--accent-bright)] shrink-0 transition-colors" />
                        <span>{t.common.dashboard || 'Dashboard'}</span>
                      </LocaleLink>

                      <LocaleLink
                        to="/dashboard/new"
                        onClick={() => setUserMenuOpen(false)}
                        className="group/uitem flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                        role="menuitem"
                      >
                        <Plus className="w-4 h-4 text-[var(--fg-muted)] group-hover/uitem:text-[var(--accent-bright)] shrink-0 transition-colors" />
                        <span>{isDe ? 'Dienst bereitstellen' : 'Deploy Service'}</span>
                      </LocaleLink>

                      <LocaleLink
                        to="/dashboard/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="group/uitem flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                        role="menuitem"
                      >
                        <Settings className="w-4 h-4 text-[var(--fg-muted)] group-hover/uitem:text-[var(--accent-bright)] shrink-0 transition-colors" />
                        <span>{t.common.profile || 'Profile & Security'}</span>
                      </LocaleLink>

                      <LocaleLink
                        to="/dashboard/support"
                        onClick={() => setUserMenuOpen(false)}
                        className="group/uitem flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                        role="menuitem"
                      >
                        <LifeBuoy className="w-4 h-4 text-[var(--fg-muted)] group-hover/uitem:text-[var(--accent-bright)] shrink-0 transition-colors" />
                        <span>{t.common.support || 'Support Tickets'}</span>
                      </LocaleLink>
                    </div>

                    <div className="border-t border-[var(--line)] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        window.location.href = localePath('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--err)] hover:bg-[var(--bg-subtle)] transition-colors text-left cursor-pointer"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>{t.common.signOut || 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <LocaleLink to="/login">
                  <Button className="h-8 px-3 text-[12.5px] rounded-lg" variant="ghost">
                    {t.common.signIn || 'Sign In'}
                  </Button>
                </LocaleLink>
                <LocaleLink to="/register">
                  <Button className="h-8 px-3.5 text-[12.5px] rounded-lg" variant="primary">
                    {t.common.register || 'Register'}
                  </Button>
                </LocaleLink>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="lg:hidden w-9 h-9 inline-flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
              aria-label={isOpen ? t.common.closeMenu : t.common.openMenu}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Directory Drawer */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 h-[calc(100dvh-4rem)] bg-[var(--bg)] z-50 flex flex-col overflow-y-auto lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="divide-y divide-[var(--line)]">
            {NAV_DROPDOWNS.map((group) => (
              <div key={group.id} className="p-5 sm:p-6">
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent-bright)] mb-3">
                  {group.label}
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] text-sm font-medium text-[var(--fg)] hover:text-[var(--accent-bright)] transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                          <span>{item.label}</span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--fg-faint)]" />
                      </a>
                    ) : (
                      <LocaleLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] text-sm font-medium text-[var(--fg)] hover:text-[var(--accent-bright)] transition-colors"
                      >
                        <Icon className="w-4 h-4 text-[var(--accent-bright)] shrink-0" />
                        <span>{item.label}</span>
                      </LocaleLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-5 sm:p-6 border-t border-[var(--line)] bg-[var(--bg-elevated)]">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="pb-3 mb-1 border-b border-[var(--line)]">
                  <p className="text-xs font-semibold text-[var(--fg)] truncate">{user.name}</p>
                  <p className="text-[11px] font-mono text-[var(--fg-muted)] truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
                <LocaleLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="vs-btn-secondary w-full justify-start"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t.common.dashboard || 'Dashboard'}</span>
                </LocaleLink>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                    window.location.href = localePath('/');
                  }}
                  className="w-full mt-1 py-2.5 text-xs text-[var(--err)] border border-[var(--line)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  {t.common.signOut || 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <LocaleLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="vs-btn-primary w-full justify-center"
                >
                  {t.common.register || 'Register'}
                </LocaleLink>
                <LocaleLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="vs-btn-secondary w-full justify-center"
                >
                  {t.common.signIn || 'Sign In'}
                </LocaleLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Footer (Real VaultScope Brand Identity & Open Architectural Directory) ──

export const Footer = () => {
  const { t, locale, localePath } = useLanguage();
  const isDe = locale === 'de';
  const officialSlogan = isDe
    ? 'Infrastruktur & Software. Gemeinsam entwickelt.'
    : 'Infrastructure & Software. Engineered together.';

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] mt-auto relative overflow-hidden">
      <div className="vs-container">
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-[var(--line)]">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <LocaleLink to="/" className="inline-flex items-center gap-2.5 mb-3">
                <Logo />
              </LocaleLink>
              <p className="text-xs font-medium text-[var(--accent-bright)] mb-2">
                Beyond Today. Built For What&apos;s Next.
              </p>
              <p className="text-[var(--fg-muted)] text-sm max-w-xs leading-relaxed">
                {officialSlogan}
              </p>
            </div>

            <div className="text-xs font-mono text-[var(--fg-faint)] space-y-1">
              <p>VaultScope · Germany (EU)</p>
              <p>support@vaultscope.de</p>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="md:col-span-2">
            <h3 className="font-sans font-semibold text-xs text-[var(--fg)] mb-4">
              {t.nav.infrastructure}
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--fg-muted)]">
              <li>
                <Link
                  to={localePath('/infrastructure/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {isDe ? 'Übersicht' : 'Overview'}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/infrastructure/cloud/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.cloudVps}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/infrastructure/dedicated/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.dedicatedServers}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/infrastructure/storage/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {isDe ? 'SFTP-Speicher' : 'SFTP Storage'}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/infrastructure/managed/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.footer.managed}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/deploy/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.oneClickDeploy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Software */}
          <div className="md:col-span-2">
            <h3 className="font-sans font-semibold text-xs text-[var(--fg)] mb-4">
              {t.nav.software}
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--fg-muted)]">
              <li>
                <Link
                  to={localePath('/software/pegasus/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.pegasus}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/software/vamos/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.vamos}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/software/camos/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.camos}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/company/open-source/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.openSource}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Company */}
          <div className="md:col-span-2">
            <h3 className="font-sans font-semibold text-xs text-[var(--fg)] mb-4">
              {t.nav.resources} & {t.nav.company}
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--fg-muted)]">
              <li>
                <Link
                  to={localePath('/docs')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.documentation}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/resources/blog/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/resources/forum/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/company/about/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/company/team/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/company/roadmap/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/company/contact/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/report/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {isDe ? 'Missbrauch melden' : 'Report Abuse'}
                </Link>
              </li>
              <li>
                <a
                  href="https://status.vaultscope.de/status/vs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--accent-bright)] transition-colors inline-flex items-center gap-1"
                >
                  <span>{t.nav.status}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h3 className="font-sans font-semibold text-xs text-[var(--fg)] mb-4">
              {t.nav.legal}
            </h3>
            <ul className="space-y-2 text-xs text-[var(--fg-muted)]">
              <li>
                <Link
                  to={localePath('/legal/privacy/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/legal/terms/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.termsOfService}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/legal/hosting-terms/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.hostingTerms}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/legal/cancellation/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.cancellationPolicy}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/legal/aup/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.acceptableUse}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/legal/dpa/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.dataProcessing}
                </Link>
              </li>
              <li>
                <Link
                  to={localePath('/legal/imprint/')}
                  className="hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.nav.imprint}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs text-[var(--fg-faint)]">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-5 items-center">
            <a
              href="https://discord.gg/84kMAY2aKm"
              target="_blank"
              rel="noreferrer"
              title="Discord Community"
              className="hover:text-[var(--accent-bright)] transition-colors inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discord</span>
            </a>
            <a
              href="https://github.com/semi-constructor"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
              className="hover:text-[var(--accent-bright)] transition-colors inline-flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── FeatureSection (Open Architectural Layout Aligned to 1400px Master Grid) ─

export const FeatureSection = ({
  title,
  description,
  features,
  reverse,
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
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-display-m text-[var(--fg)] mb-3">
          {parseHighlight(title)}
        </h2>
        {description && (
          <p className="text-body-l text-[var(--fg-muted)] max-w-[62ch]">
            {description}
          </p>
        )}
      </div>

      {features && features.length > 0 && (
        <div className="divide-y divide-[var(--line)]">
          {features.map((f, i) => (
            <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--fg)] shrink-0 sm:w-52">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed flex-1">
                {f.desc}
              </p>
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
      <section className="py-12 lg:py-16 relative overflow-hidden">
        <div className="vs-container relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className={`lg:col-span-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
              {textContent}
            </div>
            <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
              {visual}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (features && features.length > 0) {
    return (
      <section className="py-12 lg:py-16 relative overflow-hidden">
        <div className="vs-container relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-[var(--fg)] mb-3">
                {parseHighlight(title)}
              </h2>
              {description && (
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">
                  {description}
                </p>
              )}
              {ctaText && ctaLink && (
                <Link to={localePath(ctaLink)}>
                  <Button variant="outline">{ctaText}</Button>
                </Link>
              )}
            </div>
            <div className="lg:col-span-7 divide-y divide-[var(--line)]">
              {features.map((f, i) => (
                <div key={i} className="py-4 grid sm:grid-cols-12 gap-3 items-baseline">
                  <h3 className="sm:col-span-4 text-sm font-semibold text-[var(--fg)]">
                    {f.title}
                  </h3>
                  <p className="sm:col-span-8 text-sm text-[var(--fg-muted)] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="vs-container relative z-10">
        <div className="max-w-4xl">{textContent}</div>
      </div>
    </section>
  );
};

// ─── PageHero (Authoritative Left-Aligned Display Heading, Zero Glow Blooms) ──

export type CtaConfig = string | { label: string; href: string };

export const PageHero = ({
  eyebrow,
  badge,
  title,
  description,
  subtitle,
  primaryCta,
  primaryLink,
  secondaryCta,
  secondaryLink,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  badge?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: CtaConfig;
  primaryLink?: string;
  secondaryCta?: CtaConfig;
  secondaryLink?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  align?: 'center' | 'left';
}) => {
  const { localePath } = useLanguage();
  const isExternal = (url?: string) => url?.startsWith('http');
  const isAnchor = (url?: string) => url?.startsWith('#');

  const resolvedTag = eyebrow ?? badge;
  const resolvedDescription = description ?? subtitle;
  const resolvedPrimaryLabel = typeof primaryCta === 'object' ? primaryCta.label : primaryCta;
  const resolvedPrimaryHref = typeof primaryCta === 'object' ? primaryCta.href : primaryLink;
  const resolvedSecondaryLabel = typeof secondaryCta === 'object' ? secondaryCta.label : secondaryCta;
  const resolvedSecondaryHref = typeof secondaryCta === 'object' ? secondaryCta.href : secondaryLink;

  const renderCta = (label: string, url: string, variant: 'primary' | 'outline') => {
    if (isExternal(url))
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <Button variant={variant}>{label}</Button>
        </a>
      );
    if (isAnchor(url))
      return (
        <a href={url}>
          <Button variant={variant}>{label}</Button>
        </a>
      );
    return (
      <Link to={localePath(url)}>
        <Button variant={variant}>{label}</Button>
      </Link>
    );
  };

  const mainCopy = (
    <div className="flex flex-col items-start text-left">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumbs items={breadcrumbs} />
      ) : resolvedTag ? (
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--accent-bright)] mb-3">
          {resolvedTag}
        </span>
      ) : null}

      <h1 className="text-display-l tracking-tight text-[var(--fg)] mb-4 max-w-4xl">
        {parseHighlight(title)}
      </h1>

      {resolvedDescription && (
        <p
          className={`text-body-l text-[var(--fg-muted)] max-w-[65ch] ${
            resolvedPrimaryLabel || resolvedSecondaryLabel ? 'mb-6' : ''
          }`}
        >
          {resolvedDescription}
        </p>
      )}

      {(resolvedPrimaryLabel || resolvedSecondaryLabel) && (
        <div className="flex flex-wrap gap-3 w-full justify-start">
          {resolvedPrimaryLabel &&
            resolvedPrimaryHref &&
            renderCta(resolvedPrimaryLabel, resolvedPrimaryHref, 'primary')}
          {resolvedSecondaryLabel &&
            resolvedSecondaryHref &&
            renderCta(resolvedSecondaryLabel, resolvedSecondaryHref, 'outline')}
        </div>
      )}
    </div>
  );

  return (
    <section className="relative pt-24 pb-10 md:pt-28 md:pb-12 overflow-hidden">
      <div className="vs-container relative z-10">
        {children ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">{mainCopy}</div>
            <div className="lg:col-span-5">{children}</div>
          </div>
        ) : (
          mainCopy
        )}
      </div>
    </section>
  );
};

// ─── SectionHeader (Direct Left-Aligned Typographic Hierarchy) ───────────────

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  description,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
}) => {
  const copy = subtitle ?? description;
  return (
    <div className="mb-8 lg:mb-10 max-w-3xl text-left">
      {eyebrow && (
        <span className="block font-mono text-xs uppercase tracking-[0.08em] text-[var(--accent-bright)] mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-display-m text-[var(--fg)] tracking-tight">{parseHighlight(title)}</h2>
      {copy && <p className="text-body-m text-[var(--fg-muted)] mt-2.5">{copy}</p>}
    </div>
  );
};

// ─── CatalogErrorState (Actionable Live Catalog Error Presentation) ──────────

export const CatalogErrorState = ({
  resourceLabel,
  resourceName,
  productLabel,
  errorDetail,
  error,
  onRetry,
  waitlistHref,
  fallbackHref,
  fallbackLabel,
  locale,
  isDe: isDeProp,
}: {
  resourceLabel?: string;
  resourceName?: string;
  productLabel?: string;
  errorDetail?: string | null;
  error?: string | null;
  onRetry: () => void;
  waitlistHref?: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  locale?: string;
  isDe?: boolean;
}) => {
  const { locale: ctxLocale, localePath } = useLanguage();
  const isDe = isDeProp ?? (locale ?? ctxLocale) === 'de';
  const resolvedLabel =
    resourceLabel ??
    resourceName ??
    productLabel ??
    (isDe ? 'Infrastruktur-Ressourcen' : 'infrastructure catalog');
  const resolvedError = errorDetail ?? error;
  const resolvedFallbackHref = waitlistHref ?? fallbackHref ?? '#waitlist';
  const resolvedFallbackLabel =
    fallbackLabel ?? (isDe ? 'Zur Warteliste' : 'Join Waitlist');

  return (
    <div
      role="alert"
      className="py-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[var(--warn)]/12 font-mono text-[11px] text-[var(--warn)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--warn)]" />
              {isDe ? 'Vorübergehender API-Fehler' : 'Temporary Catalog Interruption'}
            </span>
            <span className="font-mono text-xs text-[var(--fg-faint)]">
              /api/storefront/catalog
            </span>
          </div>

          <h3 className="text-sm font-sans font-semibold text-[var(--fg)]">
            {isDe
              ? `Live-Bestand und Preise für ${resolvedLabel} konnten nicht geladen werden`
              : `Unable to load live ${resolvedLabel} pricing and inventory`}
          </h3>

          <p className="text-xs font-sans text-[var(--fg-muted)] leading-relaxed max-w-2xl">
            {isDe
              ? 'Die Verbindung zum VAMOS-Katalogdienst ist vorübergehend unterbrochen. Alle technischen Spezifikationen, Dokumentationen und die Wartelisten-Registrierung auf dieser Seite bleiben vollständig nutzbar.'
              : 'The connection to the live VAMOS catalog endpoint is temporarily unavailable. All technical specifications, architecture details, and waitlist registration on this page remain fully usable.'}
            {resolvedError ? ` (${resolvedError})` : ''}
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-wrap lg:justify-end items-center gap-2.5">
          <button
            type="button"
            onClick={onRetry}
            className="btn-secondary h-9 px-3.5 text-xs"
          >
            {isDe ? 'Erneut versuchen' : 'Retry Catalog'}
          </button>
          <a href={resolvedFallbackHref} className="btn-primary h-9 px-3.5 text-xs">
            {resolvedFallbackLabel}
          </a>
          <Link
            to={localePath('/company/contact/')}
            className="text-xs font-sans font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] px-2 py-1.5 transition-colors"
          >
            {isDe ? 'Vertrieb kontaktieren' : 'Contact Engineering'}
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── ComparisonTable (Open Horizontal-Hairline Specification Matrix) ──────────

export const ComparisonTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) => (
  <RuledTable>
    <table className="w-full min-w-[520px] sm:min-w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-[var(--line)]">
          {headers.map((h, i) => (
            <th
              key={i}
              className="py-3.5 px-5 first:pl-0 last:pr-0 font-mono text-xs text-[var(--fg-muted)] font-medium"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--line)] text-sm">
        {rows.map((row, rIdx) => (
          <tr key={rIdx} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
            {row.map((cell, cIdx) => (
              <td
                key={cIdx}
                className={`py-3.5 px-5 first:pl-0 last:pr-0 ${
                  cIdx === 0
                    ? 'font-mono text-xs font-medium text-[var(--fg)]'
                    : 'text-[var(--fg-muted)]'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </RuledTable>
);

// ─── CTABlock (Open Architectural Action Band) ────────────────────────────────

export const CTABlock = ({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) => {
  const { localePath } = useLanguage();
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="vs-container flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className="text-display-m text-[var(--fg)] tracking-tight mb-2">
            {parseHighlight(title)}
          </h2>
          {subtitle && <p className="text-body-m text-[var(--fg-muted)]">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to={localePath(primaryHref)}>
            <Button variant="primary">{primaryLabel}</Button>
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link to={localePath(secondaryHref)}>
              <Button variant="outline">{secondaryLabel}</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── LegalDocumentLayout (Open Editorial Legal & Compliance Layout) ───────────

const LEGAL_DOC_LINKS = [
  { href: '/legal/imprint', label: 'Imprint (Impressum)', code: 'TMG §5' },
  { href: '/legal/privacy', label: 'Privacy Policy', code: 'GDPR' },
  { href: '/legal/terms', label: 'Terms of Service', code: 'AGB' },
  { href: '/legal/hosting-terms', label: 'Hosting Terms', code: 'SLA/KVM' },
  { href: '/legal/aup', label: 'Acceptable Use Policy', code: 'AUP' },
  { href: '/legal/dpa', label: 'Data Processing Agreement', code: 'Art. 28' },
  { href: '/legal/cancellation', label: 'Cancellation Policy', code: 'Widerruf' },
];

export const LegalDocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { localePath, stripLocale } = useLanguage();
  const currentPath = stripLocale(location.pathname).replace(/\/$/, '');

  return (
    <section className="py-16 lg:py-20 relative bg-[var(--bg-canvas)]">
      <div className="vs-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <aside className="lg:col-span-3 lg:sticky lg:top-28 lg:pr-8 lg:border-r border-[var(--line)] space-y-8">
            <div className="space-y-4">
              <div className="border-b border-[var(--line)] pb-3 flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-bright)]">
                  Legal Directory
                </span>
                <span className="text-[11px] font-mono text-[var(--fg-faint)]">EU / DE</span>
              </div>
              <nav aria-label="Legal documents" className="space-y-1">
                {LEGAL_DOC_LINKS.map((doc) => {
                  const isActive = currentPath === doc.href;
                  return (
                    <Link
                      key={doc.href}
                      to={localePath(doc.href)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-[4px] text-xs transition-colors ${
                        isActive
                          ? 'bg-[var(--accent-subtle)] text-[var(--fg)] font-medium'
                          : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]/50'
                      }`}
                    >
                      <span>{doc.label}</span>
                      <span className="font-mono text-[10px] text-[var(--fg-faint)]">{doc.code}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[var(--line)] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--fg)]">
                  Regulatory Ledger
                </span>
                <span className="text-[10px] font-mono text-emerald-500">ACTIVE</span>
              </div>
              <dl className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-mono text-[var(--fg-faint)]">Jurisdiction</dt>
                  <dd className="font-mono text-[var(--fg)]">Germany (BGB / GDPR)</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-mono text-[var(--fg-faint)]">Entity</dt>
                  <dd className="font-mono text-[var(--fg)]">Anton Schmidt</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-mono text-[var(--fg-faint)]">Legal Contact</dt>
                  <dd className="font-mono text-[var(--accent-bright)]">cptcr@proton.me</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="lg:col-span-9 [&_p]:max-w-[75ch] [&_li]:max-w-[75ch]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};


