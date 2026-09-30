// Geometría de marca (figuras, fotogramas y wordmark) y secuencias de animación.
// Los trazados viven en brand.json (caja 100×100 para las figuras).
import brand from "./brand.json";

export type FigName = "buho" | "caballo" | "paloma";
export type FigVariant = "menor" | "mayor";

type Frames = Record<string, string>;

export const FIGS = brand.figs as Record<FigName, Record<FigVariant, string>>;
export const WORDMARK = brand.wordmark as { vb: string; d: string; sq: (string | number)[] };

const FRAMES = brand.frames as unknown as {
  buho: Record<FigVariant, Frames>;
  caballo: { run: Frames };
  paloma: { flap: Frames };
};

/** Paso de animación: [fotograma, rotación (grados), desplazamiento vertical]. */
type Step = [string, number, number];

interface Sequence {
  fps: number;
  steps: Step[];
  /** Origen de la rotación, en la caja 100×100. */
  origin: [number, number];
  frames: (variant: FigVariant) => Frames;
}

// A pocos fps, estilo dibujo animado a mano (mismo ritmo que el kit del prototipo).
export const SEQ: Record<FigName, Sequence> = {
  buho: {
    fps: 5,
    frames: (v) => FRAMES.buho[v],
    steps: [["s1", 0, 0], ["s2", 0.5, 0], ["blink1", 0.8, 0], ["blink2", 0.8, 0], ["s3", 0.5, 0], ["s4", 0, 0], ["s1", -0.5, 0], ["s2", -0.8, 0], ["s3", -0.5, 0], ["s4", 0, 0]],
    origin: [50, 85],
  },
  caballo: {
    // Las 5 posturas de galope del dibujo original con una intermedia entre cada par (10 fotogramas).
    // Empieza en el galope volador (= dibujo quieto) y la última intermedia vuelve a él: empalma al parar.
    fps: 12,
    frames: () => FRAMES.caballo.run,
    steps: [["g1", 0, -0.5], ["g2", 0.25, -0.25], ["g3", 0.5, 0], ["g4", 0, -0.75], ["g5", -0.5, -1.5], ["g6", -1, -1], ["g7", -1.5, -0.5], ["g8", -0.25, -0.25], ["g9", 1, 0], ["g10", 0.5, -0.25]],
    origin: [50, 50],
  },
  paloma: {
    // Aleteo simétrico: el ala baja y vuelve a subir por los mismos pasos, así el ciclo empalma
    fps: 10,
    frames: () => FRAMES.paloma.flap,
    steps: [["f1", 0, 1], ["f2", 0, 0.5], ["f3", 0, -0.5], ["f4", 0, -1.5], ["f5", 0, -2], ["f6", 0, -1.5], ["f7", 0, -0.5], ["f8", 0, 0.5]],
    origin: [50, 50],
  },
};

export const FIG_NAMES: FigName[] = ["buho", "caballo", "paloma"];

