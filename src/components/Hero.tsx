import { useEffect, useRef, useState } from "react";
import { FIG_NAMES } from "@/brand";
import { Fig } from "./Fig";
import { Wordmark } from "./Wordmark";

const LETTERS = "sesmi";
const TAGLINE = "Conocimiento en abierto, para cualquiera.";

function Trio() {
  return (
    <>
      {FIG_NAMES.map((n) => <Fig key={n} name={n} variant="mayor" anim />)}
    </>
  );
}

/**
 * Portada: patrón «s e s m i» con el wordmark grande. Una lupa cuadrada que sigue al cursor
 * invierte la tinta y descubre «debemos saber.» sobre un patrón de figuras. En pantallas táctiles
 * no hay lupa: tocar la portada la voltea entera a esa cara oculta y otro toque la devuelve. Mientras el wordmark grande está a la vista, la barra
 * superior oculta el suyo (clase html.hero-wm-visible).
 */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const hboxRef = useRef<HTMLHeadingElement>(null);
  const [grid, setGrid] = useState<{ cols: number; rows: number; pw: number }>({ cols: 0, rows: 0, pw: 0 });

  // Patrón a la medida del hero (se recalcula al redimensionar)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const measure = () => {
      if (!hero.clientWidth) return;
      const cs = getComputedStyle(hero);
      const pw = parseFloat(cs.getPropertyValue("--pw")), ph = parseFloat(cs.getPropertyValue("--ph"));
      const cols = Math.ceil(hero.clientWidth / pw) + 2, rows = Math.ceil(hero.clientHeight / ph) + 1;
      setGrid((g) => (g.cols === cols && g.rows === rows && g.pw === pw ? g : { cols, rows, pw }));
    };
    measure();
    let rt: number | undefined;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(measure, 150); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(rt); };
  }, []);

  // Lupa: sigue al ratón; en táctil, tocar voltea la portada entera
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const setPos = (e: PointerEvent) => {
      const b = hero.getBoundingClientRect();
      hero.style.setProperty("--x", e.clientX - b.left + "px");
      hero.style.setProperty("--y", e.clientY - b.top + "px");
    };
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      const enter = (e: PointerEvent) => { setPos(e); hero.classList.add("on"); };
      const leave = () => hero.classList.remove("on");
      hero.addEventListener("pointerenter", enter);
      hero.addEventListener("pointermove", setPos);
      hero.addEventListener("pointerleave", leave);
      return () => {
        hero.removeEventListener("pointerenter", enter);
        hero.removeEventListener("pointermove", setPos);
        hero.removeEventListener("pointerleave", leave);
      };
    }
    // Táctil: tocar la portada la voltea entera (sesmi ⇄ «debemos saber.»); otro toque la devuelve
    const root = document.documentElement;
    const down = (e: PointerEvent) => {
      setPos(e);
      const flipped = hero.classList.toggle("flip");
      root.classList.toggle("hero-flip", flipped);
    };
    hero.addEventListener("pointerdown", down);
    return () => { hero.removeEventListener("pointerdown", down); root.classList.remove("hero-flip"); };
  }, []);

  // Wordmark de la barra: oculto mientras el grande del hero está a la vista
  useEffect(() => {
    const root = document.documentElement, box = hboxRef.current;
    root.classList.add("hero-wm-visible");
    if (!box) return;
    const io = new IntersectionObserver((es) => root.classList.toggle("hero-wm-visible", es[0].isIntersecting), {
      rootMargin: "-70px 0px 0px 0px",
    });
    io.observe(box);
    return () => { io.disconnect(); root.classList.remove("hero-wm-visible"); };
  }, []);

  const cells = Array.from({ length: grid.cols * grid.rows }, (_, k) => [Math.floor(k / grid.cols), k % grid.cols]);
  const patStyle = grid.cols ? { gridTemplateColumns: `repeat(${grid.cols},${grid.pw}px)` } : undefined;

  return (
    <div className="hero" data-anim-host="" ref={heroRef}>
      <div className="hl base">
        <div className="pat" aria-hidden="true" style={patStyle}>
          {cells.map(([r, c]) => <span key={r * 1000 + c}>{LETTERS[(c + r * 2) % 5]}</span>)}
        </div>
        <h1 className="hbox" ref={hboxRef}>
          <span className="ht-wm"><Wordmark /></span>
          <span className="vh">: debemos saber.</span>
        </h1>
        <p className="hk">{TAGLINE}</p>
        <div className="trio" aria-hidden="true"><Trio /></div>
      </div>
      <div className="hl inv" aria-hidden="true">
        <div className="pat" style={patStyle}>
          {cells.map(([r, c]) => (
            <span key={r * 1000 + c}>
              <svg viewBox="0 0 100 100" focusable="false"><use href={`#f-${FIG_NAMES[(c + r) % 3]}`} /></svg>
            </span>
          ))}
        </div>
        <div className="hbox"><div className="ht">debemos saber<span className="dot" /></div></div>
        <p className="hk">{TAGLINE}</p>
        <div className="trio"><Trio /></div>
      </div>
      <span className="cur" aria-hidden="true" />
    </div>
  );
}
