import { useRef, useState, type FormEvent } from "react";
import { Arrow } from "./Sprite";

interface WaitlistRowProps {
  id: string;
  inputId: string;
  sub: string;
}

/**
 * Fila-formulario de aviso. MOCK: no hay backend todavía; valida el email en el navegador
 * y confirma en la propia fila («Apuntado. Te avisamos cuando salga.»).
 */
export function WaitlistRow({ id, inputId, sub }: WaitlistRowProps) {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const i = input.current;
    if (!i) return;
    if (!i.value || !i.checkValidity()) {
      i.focus();
      setMsg("Escribe un email válido.");
      return;
    }
    // TODO: conectar con el backend de avisos (Resend / webhook n8n).
    setDone(true);
    setMsg("Apuntado. Te avisamos cuando salga.");
  };

  return (
    <form className={done ? "row wl done" : "row wl"} id={id} noValidate onSubmit={onSubmit}>
      <div className="n">Aviso</div>
      <div className="t">
        <label className="rt" htmlFor={inputId}>Recibe los informes cuando salgan.</label>
        <span className="rs">{sub}</span>
      </div>
      <div className="mc">
        <input ref={input} id={inputId} name="email" type="email" autoComplete="email" placeholder="tu@email.com" required />
        <p className="ok" role="status" aria-live="polite">{msg}</p>
      </div>
      <button className="a" type="submit" aria-label="Apuntarme"><Arrow /></button>
    </form>
  );
}
