import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import type { FigName } from "@/brand";
import { Sprite } from "./Sprite";
import { Wordmark } from "./Wordmark";

const SECTIONS = [
  { to: "/investigacion", label: "Investigación" },
  { to: "/servicios", label: "Servicios" },
  { to: "/divulgacion", label: "Divulgación" },
  { to: "/nosotros", label: "Nosotros" },
];

export const SITE_TITLE = "sesmi · Sociedad Económica de San Miguel";

/** Título del documento y figura del favicon por ruta. */
const META: Record<string, { title: string; icon?: FigName }> = {
  "/": { title: SITE_TITLE },
  "/investigacion": { title: "Investigación · sesmi", icon: "buho" },
  "/servicios": { title: "Servicios · sesmi", icon: "caballo" },
  "/divulgacion": { title: "Divulgación · sesmi", icon: "paloma" },
  "/nosotros": { title: "Nosotros · sesmi" },
};
const NOT_FOUND = { title: "Página no encontrada · sesmi" };

function useRouteMeta(pathname: string) {
  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const meta = META[path] || NOT_FOUND;
    document.title = meta.title;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      document.head.appendChild(link);
    }
    const href = "icon" in meta && meta.icon ? `/favicon-${meta.icon}.svg` : "/favicon.svg";
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  }, [pathname]);
}

/**
 * Al navegar: arriba del todo, o al ancla (#id) si la hay. Si solo cambia el ancla dentro de la
 * misma página, el desplazamiento sigue el scroll-behavior del CSS (suave salvo reduced-motion).
 */
function useScrollOnNavigate() {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    try { history.scrollRestoration = "manual"; } catch { /* sin soporte */ }
  }, []);

  useLayoutEffect(() => {
    const first = prevPath.current === null;
    const samePage = prevPath.current === pathname;
    prevPath.current = pathname;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const behavior: ScrollBehavior = samePage && id ? "auto" : "instant";
    const go = () => {
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    };
    go();
    if (samePage && id) return;
    const raf = requestAnimationFrame(go);
    // En la primera carga con ancla, las fuentes pueden mover el contenido: recolocar al cargarlas.
    if (first && id && document.fonts) document.fonts.ready.then(go);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, key]);
}

const skipToContent = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  document.getElementById("contenido")?.focus();
};

/** Armazón del sitio: retícula a sangre, barra superior, nav móvil de 4 celdas, contenido y pie. */
export function SiteLayout() {
  const { pathname } = useLocation();
  useRouteMeta(pathname);
  useScrollOnNavigate();

  return (
    <div className="frame">
      <Sprite />
      <a className="skip" href="#contenido" onClick={skipToContent}>Saltar al contenido</a>
      <header className="top">
        <Link className="brand" to="/" aria-label="sesmi, inicio"><Wordmark label="sesmi" /></Link>
        <span className="org">Sociedad Económica de San Miguel</span>
        <nav aria-label="Principal">
          {SECTIONS.map((s) => <NavLink key={s.to} to={s.to}>{s.label}</NavLink>)}
          <Link className="cta" to="/nosotros#contacto">Contacto</Link>
        </nav>
      </header>
      <nav className="mnav" aria-label="Secciones">
        {SECTIONS.map((s) => <NavLink key={s.to} to={s.to}>{s.label}</NavLink>)}
      </nav>

      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="foot">
        <div className="q"><div /><p>Para cualquier pregunta: <a href="mailto:hola@sesmi.org">hola@sesmi.org</a></p></div>
        <div className="b">
          <div className="f"><Wordmark /></div>
          <div className="ln">
            <span>Sociedad Económica de San Miguel</span>
            <span>Talavera de la Reina, Toledo</span>
            <span>hola@sesmi.org</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
