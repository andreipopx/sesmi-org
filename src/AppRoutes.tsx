import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import Index from "./pages/Index";
import Investigacion from "./pages/Investigacion";
import Servicios from "./pages/Servicios";
import Divulgacion from "./pages/Divulgacion";
import Nosotros from "./pages/Nosotros";
import NotFound from "./pages/NotFound";

/** Rutas del sitio. Las direcciones antiguas (v1, en inglés) redirigen a las nuevas. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/investigacion" element={<Investigacion />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/divulgacion" element={<Divulgacion />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/research" element={<Navigate replace to="/investigacion" />} />
      <Route path="/research/:id" element={<Navigate replace to="/investigacion#sesmi-001" />} />
      <Route path="/services" element={<Navigate replace to="/servicios" />} />
      <Route path="/learning" element={<Navigate replace to="/divulgacion" />} />
      <Route path="/academia" element={<Navigate replace to="/divulgacion" />} />
    </Routes>
  );
}
