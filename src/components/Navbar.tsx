import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const navLinks = [
  { to: '/', key: 'home' as const },
  { to: '/research', key: 'research' as const },
  { to: '/services', key: 'services' as const },
  { to: '/learning', key: 'learning' as const },
  { to: '/nosotros', key: 'about' as const },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

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
        <Link
          to="/"
          className="font-grotezk lowercase text-ink"
          style={{ fontSize: '20px' }}
        >
          sesmi
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center" style={{ gap: '32px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono uppercase text-ink"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                opacity: isActive(link.to) ? 1 : undefined,
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = '0.6';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = isActive(link.to) ? '1' : '';
              }}
            >
              {t.nav[link.key]}
            </Link>
          ))}

          {/* Language switcher */}
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
            <span className="text-muted"> / </span>
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

          {/* CTA */}
          <Link
            to="/nosotros#contacto"
            className="font-mono uppercase text-offwhite"
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              backgroundColor: 'var(--ink)',
              padding: '8px 16px',
              transition: 'background-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--ink-secondary)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--ink)';
            }}
          >
            {t.nav.contact}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col"
          style={{ gap: '5px', padding: '8px' }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className="block bg-ink"
            style={{ width: '20px', height: '1px' }}
          />
          <span
            className="block bg-ink"
            style={{ width: '20px', height: '1px' }}
          />
          <span
            className="block bg-ink"
            style={{ width: '20px', height: '1px' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t border-line"
          style={{
            backgroundColor: 'var(--bg)',
            animation: 'fadeIn 150ms ease forwards',
          }}
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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="font-mono uppercase text-ink"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                }}
              >
                {t.nav[link.key]}
              </Link>
            ))}

            {/* Mobile language switcher */}
            <div
              className="flex items-center font-mono uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.08em', gap: '4px' }}
            >
              <button
                onClick={() => setLang('es')}
                style={{
                  color: lang === 'es' ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: lang === 'es' ? 700 : 400,
                }}
              >
                ES
              </button>
              <span className="text-muted">/</span>
              <button
                onClick={() => setLang('en')}
                style={{
                  color: lang === 'en' ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: lang === 'en' ? 700 : 400,
                }}
              >
                EN
              </button>
            </div>

            <Link
              to="/nosotros#contacto"
              onClick={() => setOpen(false)}
              className="font-mono uppercase text-offwhite w-fit"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                backgroundColor: 'var(--ink)',
                padding: '8px 16px',
              }}
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
