import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "@/AppRoutes";

const at = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );

describe("rutas", () => {
  it.each([
    ["/investigacion", "Investigación independiente, en abierto"],
    ["/servicios", "Análisis riguroso para ciudades reales"],
    ["/divulgacion", "El conocimiento es un bien público"],
    ["/nosotros", "Suficiente experiencia para saber cómo se hace."],
  ])("%s tiene su h1", (path, h1) => {
    at(path);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(h1);
    expect(document.title).toMatch(/sesmi/);
  });

  it("inicio pinta el hero y las dos publicaciones", () => {
    at("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("debemos saber");
    expect(screen.getByText("¡Bienvenido, Mr. Meta!")).toBeInTheDocument();
  });

  it.each([
    ["/research", "Investigación independiente, en abierto"],
    ["/research/sesmi-001", "Investigación independiente, en abierto"],
    ["/services", "Análisis riguroso para ciudades reales"],
    ["/learning", "El conocimiento es un bien público"],
    ["/academia", "El conocimiento es un bien público"],
  ])("redirige %s", (path, h1) => {
    at(path);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(h1);
  });

  it("404 con la retícula", () => {
    at("/no-existe");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Esta página no existe.");
  });

  it("el formulario de aviso es un mock que confirma en la fila", async () => {
    at("/investigacion");
    const input = screen.getByLabelText("Recibe los informes cuando salgan.") as HTMLInputElement;
    input.value = "hola@sesmi.org";
    input.form!.requestSubmit();
    expect(await screen.findByText("Apuntado. Te avisamos cuando salga.")).toBeInTheDocument();
  });
});
