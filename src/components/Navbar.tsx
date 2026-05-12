import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

type NavItem =
  | { type: 'internal'; to: string; key: 'research' | 'services' }
  | { type: 'external'; href: string; key: 'academy' };

const navItems: NavItem[] = [
  { type: 'internal', to: '/research', key: 'research' },
  { type: 'external', href: 'https://academia.sesmi.org', key: 'academy' },
  { type: 'internal', to: '/services', key: 'services' },
];

const linkBaseStyle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.08em',
  transition: 'opacity 150ms ease',
  color: 'var(--ink)',
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

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
          className="font-mono uppercase"
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
        className="font-mono uppercase"
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

  const LangSwitcher = () => (
    <div
      className="flex items-center font-mono uppercase"
      style={{ fontSize: '11px', letterSpacing: '0.08em' }}
    >
      <button
        onClick={() => setLang('es')}
        className="px-1 py-0.5"
        style={{
          color: lang === 'es' ? 'var(--ink)' : 'var(--muted)',
          fontWeight: lang === 'es' ? 700 : 400,
          transition: 'color 150ms ease',
        }}
      >
        ES
      </button>
      <span style={{ color: 'var(--muted)' }}> / </span>
      <button
        onClick={() => setLang('en')}
        className="px-1 py-0.5"
        style={{
          color: lang === 'en' ? 'var(--ink)' : 'var(--muted)',
          fontWeight: lang === 'en' ? 700 : 400,
          transition: 'color 150ms ease',
        }}
      >
        EN
      </button>
    </div>
  );

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
        <Link to="/" className="font-grotezk lowercase text-ink" style={{ fontSize: '20px' }}>
          sesmi
        </Link>

        {/* Center links */}
        <div
          className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2"
          style={{ gap: '32px' }}
        >
          {navItems.map((item) => renderItem(item))}
        </div>

        {/* Right: lang switcher */}
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
              paddingTop: '24px',
              paddingBottom: '24px',
              gap: '16px',
            }}
          >
            {navItems.map((item) => renderItem(item, () => setOpen(false)))}
            <LangSwitcher />
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
