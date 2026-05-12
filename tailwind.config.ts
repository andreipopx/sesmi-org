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
        bg: {
          DEFAULT: "#F7F3EE",
          2: "#F0EBE3",
          3: "#E8E1D6",
        },
        ink: {
          DEFAULT: "#1C1814",
          secondary: "#2E2720",
        },
        accent: "#7A1F10",
        muted: {
          DEFAULT: "#8A7F74",
          2: "#B5AA9E",
        },
        offwhite: "#FAF8F5",
        line: "rgba(28,24,20,0.1)",
        border: "rgba(28,24,20,0.1)",
        input: "rgba(28,24,20,0.1)",
        ring: "#7A1F10",
        background: "#F7F3EE",
        foreground: "#1C1814",
        primary: {
          DEFAULT: "#7A1F10",
          foreground: "#FAF8F5",
        },
        secondary: {
          DEFAULT: "#F0EBE3",
          foreground: "#1C1814",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "#F7F3EE",
          foreground: "#1C1814",
        },
        card: {
          DEFAULT: "#F0EBE3",
          foreground: "#1C1814",
        },
      },
      fontFamily: {
        grotezk: ["Apfel Grotezk Mittel", "serif"],
        editorial: ["Junicode", "Georgia", "serif"],
        mono: ["Liberation Mono", "monospace"],
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        full: "9999px",
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
