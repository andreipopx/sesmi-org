import { PillarHeader } from "@/components/PillarHeader";
import { RowLink } from "@/components/RowLink";
import { Fig } from "@/components/Fig";

const NotFound = () => (
  <>
    <PillarHeader
      label="404"
      title="Esta página no existe."
      intro="Puede que la dirección haya cambiado o que nunca haya existido. Estas son las tres patas de la casa:"
    />
    <RowLink to="/investigacion" n={<Fig name="buho" />} title="Investigación" sub="Investigación independiente, en abierto." />
    <RowLink to="/servicios" n={<Fig name="caballo" />} title="Servicios" sub="Hoy, análisis económico para empresas y organismos públicos." />
    <RowLink to="/divulgacion" n={<Fig name="paloma" />} title="Divulgación" sub="Datos y materiales para quien quiera aprender." />
  </>
);

export default NotFound;
