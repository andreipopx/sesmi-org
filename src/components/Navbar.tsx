import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type NavItem = { type: 'internal'; to: string; key: 'research' | 'services' | 'academy' };

const navItems: NavItem[] = [
  { type: 'internal', to: '/research', key: 'research' },
  { type: 'internal', to: '/academia', key: 'academy' },
  { type: 'internal', to: '/services', key: 'services' },
];

const linkBaseStyle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.10em',
  transition: 'opacity 150ms ease',
  color: 'var(--ink)',
};

const LangSwitcher = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const langs: Array<'es' | 'en'> = ['es', 'en'];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Idioma"
        aria-expanded={open}
        className="flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          color: 'var(--ink)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Globe size={18} strokeWidth={1.5} />
      </button>
      {open && (
        <div
          className="absolute right-0 flex flex-col"
          style={{
            top: 'calc(100% + 6px)',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            minWidth: 80,
            zIndex: 60,
          }}
        >
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className="font-haas uppercase text-left"
              style={{
                fontSize: '9px',
                letterSpacing: '0.12em',
                padding: '8px 12px',
                color: lang === l ? 'var(--ink)' : 'var(--muted)',
                fontWeight: lang === l ? 700 : 400,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {l === 'es' ? 'ES' : 'EN'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const renderLabel = (item: NavItem) =>
    (t.nav as Record<string, string>)[item.key].toUpperCase();

  const renderItem = (item: NavItem, onClick?: () => void) => {
    if (item.type === 'external') {
      return (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="font-haas uppercase"
          style={linkBaseStyle}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '0.6')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '1')}
        >
          {renderLabel(item)}
        </a>
      );
    }
    return (
      <Link
        key={item.key}
        to={item.to}
        onClick={onClick}
        className="font-haas uppercase"
        style={{ ...linkBaseStyle, opacity: isActive(item.to) ? 1 : undefined }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '0.6')}
        onMouseLeave={(e) =>
          ((e.target as HTMLElement).style.opacity = isActive(item.to) ? '1' : '1')
        }
      >
        {renderLabel(item)}
      </Link>
    );
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-line"
      style={{
        height: 'var(--nav-height)',
        backgroundColor: 'rgba(247, 243, 238, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between"
        style={{
          maxWidth: '1280px',
          paddingLeft: 'clamp(24px, 4vw, 48px)',
          paddingRight: 'clamp(24px, 4vw, 48px)',
        }}
      >
        {/* Wordmark */}
        <Link to="/" aria-label="sesmi" className="flex items-center">
          <img src="/logo-sesmi.svg" alt="sesmi" style={{ height: '32px', width: 'auto', display: 'block' }} />
        </Link>

        {/* Center links */}
        <div
          className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2"
          style={{ gap: '48px' }}
        >
          {navItems.map((item) => renderItem(item))}
        </div>

        {/* Right: globe */}
        <div className="hidden md:flex items-center">
          <LangSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col"
          style={{ gap: '5px', padding: '8px' }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="block bg-ink" style={{ width: '20px', height: '1px' }} />
          <span className="block bg-ink" style={{ width: '20px', height: '1px' }} />
          <span className="block bg-ink" style={{ width: '20px', height: '1px' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t border-line"
          style={{ backgroundColor: 'var(--bg)', animation: 'fadeIn 150ms ease forwards' }}
        >
          <div
            className="flex flex-col"
            style={{
              paddingLeft: 'clamp(24px, 4vw, 48px)',
              paddingRight: 'clamp(24px, 4vw, 48px)',
              paddingTop: '20px',
              paddingBottom: '20px',
              gap: '14px',
            }}
          >
            {navItems.map((item) => renderItem(item, () => setOpen(false)))}
            <div style={{ paddingTop: '4px' }}>
              <LangSwitcher />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </nav>
  );
};

export default Navbar;
