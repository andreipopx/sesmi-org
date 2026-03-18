import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-bg2 border-t border-sesmi-line">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* Col 1 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="logo-dot inline-block w-[7px] h-[7px] rounded-full bg-warm" />
          <span className="font-mono text-sm tracking-[0.18em] uppercase font-medium text-ink">SESMI</span>
        </div>
        <p className="text-sm text-sesmi-muted leading-relaxed">
          Sociedad Económica de San Miguel
        </p>
        <p className="text-sm text-sesmi-muted mt-1">
          Talavera de la Reina, Toledo, España
        </p>
      </div>

      {/* Col 2 */}
      <div className="flex flex-col gap-2">
        <span className="label-style text-sesmi-muted mb-2">Navegación</span>
        {[
          { to: '/', label: 'Home' },
          { to: '/research', label: 'Research' },
          { to: '/services', label: 'Services' },
          { to: '/learning', label: 'Learning' },
          { to: '/nosotros', label: 'Nosotros' },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-sesmi-muted hover:text-ink transition-colors interactive">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Col 3 */}
      <div className="flex flex-col gap-2">
        <span className="label-style text-sesmi-muted mb-2">Contacto</span>
        <a href="mailto:hola@sesmi.org" className="text-sm text-sesmi-muted hover:text-ink transition-colors interactive">
          hola@sesmi.org
        </a>
        <span className="text-sm text-sesmi-muted">sesmi.org</span>
      </div>
    </div>

    <div className="border-t border-sesmi-line px-6 py-4">
      <p className="text-center font-mono text-[0.55rem] tracking-[0.12em] uppercase text-muted2">
        © 2025 Sesmi · Sociedad Económica de San Miguel
      </p>
    </div>
  </footer>
);

export default Footer;
