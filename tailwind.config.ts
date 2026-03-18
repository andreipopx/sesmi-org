import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--sesmi-line)",
        input: "var(--sesmi-line)",
        ring: "var(--sesmi-warm)",
        background: "var(--sesmi-bg)",
        foreground: "var(--sesmi-ink)",
        bg: "var(--sesmi-bg)",
        bg2: "var(--sesmi-bg2)",
        bg3: "var(--sesmi-bg3)",
        ink: "var(--sesmi-ink)",
        ink2: "var(--sesmi-ink2)",
        warm: "var(--sesmi-warm)",
        warm2: "var(--sesmi-warm2)",
        sand: "var(--sesmi-sand)",
        "sesmi-muted": "var(--sesmi-muted)",
        muted2: "var(--sesmi-muted2)",
        "sesmi-white": "var(--sesmi-white)",
        "sesmi-line": "var(--sesmi-line)",
        primary: {
          DEFAULT: "var(--sesmi-warm)",
          foreground: "var(--sesmi-white)",
        },
        secondary: {
          DEFAULT: "var(--sesmi-bg2)",
          foreground: "var(--sesmi-ink)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--sesmi-muted)",
          foreground: "var(--sesmi-muted)",
        },
        accent: {
          DEFAULT: "var(--sesmi-bg3)",
          foreground: "var(--sesmi-ink)",
        },
        popover: {
          DEFAULT: "var(--sesmi-bg)",
          foreground: "var(--sesmi-ink)",
        },
        card: {
          DEFAULT: "var(--sesmi-bg2)",
          foreground: "var(--sesmi-ink)",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
