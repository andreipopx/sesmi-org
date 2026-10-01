import { Link } from "react-router-dom";
import type { FigName } from "@/brand";
import { Arrow } from "@/components/Sprite";
import { Fig } from "@/components/Fig";
import { Hero } from "@/components/Hero";
import { RowLink } from "@/components/RowLink";
import { Illustration } from "@/components/Illustration";
import { WaitlistRow } from "@/components/WaitlistRow";
import { Sesmi } from "@/components/Wordmark";

const DOORS: { to: string; fig: FigName; title: string; lema: string; text: string }[] = [
  { to: "/investigacion", fig: "buho", title: "Investigación", lema: "Debemos saber", text: "Investigación independiente y en abierto, sin paywalls. Empezamos por la economía de las ciudades medias." },
  { to: "/servicios", fig: "caballo", title: "Servicios", lema: "Fuerza aplicada", text: "Hoy, análisis económico para empresas y organismos públicos. Abiertos a sumar otras disciplinas." },
  { to: "/divulgacion", fig: "paloma", title: "Divulgación", lema: "Socorre enseñando", text: "Datos, herramientas y materiales para estudiantes, profesores y cualquiera con ganas de aprender." },
];

const Index = () => (
  <>
    <Hero />

    <div className="cards" role="group" aria-label="Publicaciones">
      <Link className="card" to="/investigacion#sesmi-001">
        <div className="meta"><span className="lbl code">SESMI-001</span><span className="st lbl"><i className="sq" />En elaboración</span></div>
        <h3>¡Bienvenido, Mr. Meta!</h3>
        <p>Un análisis económico independiente del Meta Data Center en Talavera de la Reina.</p>
        <span className="go lbl">Ver capítulos <Arrow /></span>
        <Illustration kind="rings" />
      </Link>
      <Link className="card" to="/investigacion#sesmi-002">
        <div className="meta"><span className="lbl code">SESMI-002</span><span className="st lbl"><i className="sq o" />Próximamente</span></div>
        <h3>Talavera, la ciudad que no arranca</h3>
        <p>Diagnóstico económico independiente de una ciudad media española.</p>
        <span className="go lbl">Ver más <Arrow /></span>
        <Illustration kind="stall" />
      </Link>
    </div>

    <nav className="doors" aria-label="Las tres patas">
      {DOORS.map((d) => (
        <Link key={d.to} className="door" to={d.to} data-anim-host="">
          <Fig name={d.fig} variant="mayor" anim className="fg" />
          <h3>{d.title}</h3>
          <p className="lm">{d.lema}</p>
          <p className="tx">{d.text}</p>
          <span className="go lbl">Entrar <Arrow /></span>
        </Link>
      ))}
    </nav>

    <Link className="row qrow" to="/nosotros">
      <div className="n" aria-hidden="true">«</div>
      <div className="t">
        <span className="qt">Las ciudades que nadie analiza merecen el mismo rigor que Madrid o Barcelona.</span>
        <span className="rs">Del manifiesto de <Sesmi /> · Quiénes somos</span>
      </div>
      <div className="a"><Arrow /></div>
    </Link>

    <RowLink
      to="/nosotros#abierta"
      n="+"
      title="Una sociedad abierta"
      sub={<>Empezamos por la economía y las matemáticas, pero <Sesmi /> es de quien quiera aprender o aportar: estudiantes, profesores y gente de cualquier disciplina.</>}
    />

    <WaitlistRow id="aviso-inicio" inputId="wl-1" sub="Déjanos tu email y te avisamos. Sin spam." />
  </>
);

export default Index;
