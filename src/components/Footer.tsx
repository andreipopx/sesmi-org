import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

type NavItem =
  | { type: 'internal'; to: string; key: 'research' | 'services' | 'about' }
  | { type: 'external'; href: string; key: 'academy' };

const navItems: NavItem[] = [
  { type: 'internal', to: '/research', key: 'research' },
  { type: 'external', href: 'https://academia.sesmi.org', key: 'academy' },
  { type: 'internal', to: '/services', key: 'services' },
  { type: 'internal', to: '/nosotros', key: 'about' },
];

const labelStyle: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '16px',
};

const orgLineStyle: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
};

const linkStyle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--ink)',
  transition: 'opacity 150ms ease',
};

const contactStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--ink)',
  transition: 'opacity 150ms ease',
};

const Footer = () => {
  const { t } = useLanguage();

  const renderNavItem = (item: NavItem) => {
    const label = (t.nav as Record<string, string>)[item.key].toUpperCase();
    const onEnter = (e: React.MouseEvent<HTMLElement>) =>
      ((e.currentTarget as HTMLElement).style.opacity = '0.6');
    const onLeave = (e: React.MouseEvent<HTMLElement>) =>
      ((e.currentTarget as HTMLElement).style.opacity = '1');

    if (item.type === 'external') {
      return (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-haas"
          style={linkStyle}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        key={item.key}
        to={item.to}
        className="font-haas"
        style={linkStyle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {label}
      </Link>
    );
  };

  return (
    <footer style={{ borderTop: '1px solid var(--line)', backgroundColor: 'var(--bg)' }}>
      <div
        className="mx-auto grid grid-cols-1 md:grid-cols-3"
        style={{
          maxWidth: '1280px',
          paddingLeft: 'clamp(24px, 4vw, 48px)',
          paddingRight: 'clamp(24px, 4vw, 48px)',
          paddingTop: '48px',
          paddingBottom: '32px',
          gap: '32px',
        }}
      >
        {/* Col 1: brand */}
        <div>
          <span
            className="wm lowercase"
            style={{ fontSize: '16px', color: 'var(--ink)', display: 'block' }}
          >
            sesmi
          </span>
          <p className="font-haas" style={{ ...orgLineStyle, marginTop: '12px' }}>
            {t.footer.org}
          </p>
          <p className="font-haas" style={orgLineStyle}>
            {t.footer.location}
          </p>
        </div>

        {/* Col 2: nav */}
        <div className="flex flex-col">
          <span className="font-haas" style={labelStyle}>
            {t.footer.navLabel}
          </span>
          <div className="flex flex-col" style={{ gap: '10px' }}>
            {navItems.map(renderNavItem)}
          </div>
        </div>

        {/* Col 3: contact */}
        <div className="flex flex-col">
          <span className="font-haas" style={labelStyle}>
            {t.footer.contactLabel}
          </span>
          <div className="flex flex-col" style={{ gap: '10px' }}>
            <a
              href="mailto:hola@sesmi.org"
              className="font-haas"
              style={contactStyle}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              hola@sesmi.org
            </a>
            <span className="font-haas" style={contactStyle}>
              sesmi.org
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          backgroundColor: 'var(--bg-2)',
          borderTop: '1px solid var(--line)',
          padding: '16px',
        }}
      >
        <p
          className="font-haas text-center"
          style={{
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          © 2025 <span className="wm" style={{ fontSize: 'inherit' }}>sesmi</span> · Sociedad Económica de San Miguel
        </p>
      </div>
    </footer>
  );
};

export default Footer;
