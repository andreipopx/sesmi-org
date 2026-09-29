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
    <RowLink to="/investigacion" n={<Fig name="buho" />} title="Investigación" sub="Análisis económico independiente, en abierto." />
    <RowLink to="/servicios" n={<Fig name="caballo" />} title="Servicios" sub="Consultoría económica para ciudades reales." />
    <RowLink to="/divulgacion" n={<Fig name="paloma" />} title="Divulgación" sub="Datos y materiales para estudiantes y profesores." />
  </>
);

export default NotFound;
