import { useState } from 'react';
import Layout from '../components/Layout';
import AnimatedEntry from '../components/AnimatedEntry';

const cities = [
  { name: 'Talavera de la Reina', active: true },
  { name: 'Ponferrada', active: false },
  { name: 'Mérida', active: false },
  { name: 'Linares', active: false },
  { name: 'Alcoy', active: false },
  { name: 'Sagunto', active: false },
];

const Nosotros = () => {
  const [formState, setFormState] = useState({ name: '', email: '', org: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // TODO: Connect to Resend via edge function
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  return (
    <Layout>
      {/* About */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <AnimatedEntry>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
            // SOBRE SESMI ───────────────────────────────
          </p>
        </AnimatedEntry>
        <AnimatedEntry delay={0.1}>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-10 max-w-4xl leading-tight">
            Suficiente experiencia para saber cómo se hace. Suficiente amor por estas ciudades para querer hacerlo aquí.
          </h1>
        </AnimatedEntry>

        {/* Manifesto */}
        <AnimatedEntry delay={0.2}>
          <div className="max-w-3xl space-y-6 text-sesmi-muted leading-relaxed mb-16">
            <p>Sesmi es el proyecto de alguien que se fue y quiso volver.</p>
            <p>
              Sesmi —Sociedad Económica de San Miguel— nace con una convicción simple: las ciudades medias de España merecen el mismo rigor analítico que Madrid y Barcelona. No informes institucionales hechos para justificar decisiones ya tomadas. No consultoras de la capital que llegan un día y se van sin entender el contexto. Análisis económico independiente, honesto, y escrito para que lo entienda cualquier persona inteligente, no solo los economistas.
            </p>
            <p>
              Creemos que la curiosidad es una obligación. Que los datos públicos son de todos. Que se puede hacer economía rigurosa sin renunciar a que la entienda la gente. Y que hay algo muy valioso en conocer bien el territorio del que hablas — no como turista analítico sino como alguien que creció en él.
            </p>
          </div>
        </AnimatedEntry>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <AnimatedEntry>
          <p className="label-style text-warm mb-8">// EQUIPO</p>
        </AnimatedEntry>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Founder */}
          <AnimatedEntry delay={0.1}>
            <div className="bg-bg2 p-8 card-hover-line">
              <div className="w-24 h-24 bg-bg3 flex items-center justify-center mb-6">
                <span className="font-display text-3xl text-sesmi-muted">F</span>
              </div>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-warm mb-2">
                FUNDADOR — ECONOMISTA
              </p>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-4">
                Matemático y economista. Ha trabajado en Deloitte y KPMG como consultor de ciberseguridad, en Huawei como asistente de CFO, y en Amadeus como data engineer. Formado en la Universidad Complutense de Madrid.
              </p>
              <div className="space-y-1.5">
                {[
                  'Matemáticas y Economía · UCM',
                  'Deloitte · Consultoría',
                  'KPMG · Consultoría',
                  'Huawei · Finanzas',
                  'Amadeus · Data Engineering',
                ].map((c) => (
                  <p key={c} className="font-mono text-[0.55rem] text-sesmi-muted">
                    <span className="text-warm">◆</span> {c}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedEntry>

          {/* Cofounder */}
          <AnimatedEntry delay={0.2}>
            <div className="bg-bg2 p-8 card-hover-line">
              <div className="w-24 h-24 bg-bg3 flex items-center justify-center mb-6">
                <span className="font-display text-3xl text-sesmi-muted">C</span>
              </div>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-warm mb-2">
                COFUNDADOR — ECONOMISTA
              </p>
              <p className="text-sm text-sesmi-muted leading-relaxed mb-4">
                Economista con máster en el Barcelona School of Economics. Research Assistant en el Banco de España.
              </p>
              <div className="space-y-1.5">
                {[
                  'Doble grado Economía y Matemáticas',
                  'BSE — Barcelona School of Economics',
                  'Banco de España · Research',
                ].map((c) => (
                  <p key={c} className="font-mono text-[0.55rem] text-sesmi-muted">
                    <span className="text-warm">◆</span> {c}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedEntry>
        </div>
      </section>

      {/* Cities */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <AnimatedEntry>
          <p className="label-style text-warm mb-6">// CIUDADES DONDE TRABAJAMOS</p>
          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <span
                key={city.name}
                className={`font-mono text-[0.6rem] uppercase tracking-[0.12em] px-3 py-1.5 border ${
                  city.active
                    ? 'border-warm text-warm'
                    : 'border-sesmi-line text-sesmi-muted'
                }`}
              >
                {city.name} {city.active && '◆'}
              </span>
            ))}
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] px-3 py-1.5 text-sesmi-muted">
              + otras ciudades medias →
            </span>
          </div>
        </AnimatedEntry>
      </section>

      {/* Contact */}
      <section id="contacto" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-sesmi-line">
          {/* Left */}
          <AnimatedEntry className="pb-8 lg:pb-0 lg:pr-12">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-sesmi-muted mb-6">
              // CONTACTO ─────────────────
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8">
              ¿Trabajamos juntos?
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Email', value: 'hola@sesmi.org' },
                { label: 'Web', value: 'sesmi.org' },
                { label: 'Base', value: 'Talavera de la Reina, Toledo' },
                { label: 'Ámbito', value: 'Ciudades medias de España' },
              ].map((item) => (
                <div key={item.label} className="flex gap-6">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-sesmi-muted w-20 shrink-0 pt-0.5">
                    {item.label}
                  </span>
                  <span className="text-sm text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </AnimatedEntry>

          {/* Right - Form */}
          <AnimatedEntry delay={0.1} className="pt-8 lg:pt-0 lg:pl-12">
            <div className="bg-bg2 p-8">
              {sent ? (
                <div className="text-center py-12">
                  <p className="font-mono text-sm text-warm">
                    Mensaje enviado. Te respondemos en menos de 48h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { key: 'name', label: 'Nombre', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' },
                    { key: 'org', label: 'Organización', type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="label-style text-sesmi-muted block mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.key !== 'org'}
                        value={formState[field.key as keyof typeof formState]}
                        onChange={(e) => setFormState(s => ({ ...s, [field.key]: e.target.value }))}
                        className="w-full px-4 py-3 bg-bg border border-sesmi-line font-sans text-sm text-ink"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="label-style text-sesmi-muted block mb-2">Mensaje</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-bg border border-sesmi-line font-sans text-sm text-ink resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-ink text-sesmi-white font-mono text-[0.65rem] uppercase tracking-[0.12em] px-6 py-3 hover:bg-ink2 transition-colors interactive disabled:opacity-50"
                  >
                    {sending ? '...' : 'Enviar →'}
                  </button>
                </form>
              )}
            </div>
          </AnimatedEntry>
        </div>
      </section>
    </Layout>
  );
};

export default Nosotros;
