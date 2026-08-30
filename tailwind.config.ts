import type { Config } from "tailwindcss";

/**
 * Palette lifted from the reference funnel: warm cream page, lavender CTAs,
 * coral for urgency (timer / "most popular"), teal for the goal state and
 * yellow for the lesson area.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F5F0",
        surface: "#FFFFFF",
        ink: { DEFAULT: "#2C2A44", soft: "#6B6880", faint: "#9B98AC" },
        violet: {
          50: "#F4F0FE",
          100: "#EBE2FF",
          300: "#C2A9FB",
          400: "#9B7BF7",
          500: "#8757F2",
          600: "#7440E8",
          700: "#5F2FCC",
        },
        coral: { 100: "#FFE7DE", 300: "#FFA184", 500: "#FF6A3D", 600: "#E9532A" },
        teal: { 100: "#D3F5EE", 500: "#2FCBAE", 600: "#1FAF95" },
        gold: { 300: "#F7D98A", 500: "#F2C14E", 600: "#D9A62F" },
        sun: "#F5EC3D",
        line: "#E9E4DB",
      },
      borderRadius: { xl2: "1.25rem", pill: "999px" },
      boxShadow: {
        card: "0 2px 10px rgba(44, 42, 68, 0.05)",
        pop: "0 8px 24px rgba(124, 92, 214, 0.20)",
      },
      maxWidth: { funnel: "27rem" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.035)" },
          "100%": { transform: "scale(1)" },
        },
        "cta-glow": {
          "0%, 100%": { boxShadow: "0 8px 24px rgba(116, 64, 232, 0.28)" },
          "50%": { boxShadow: "0 10px 34px rgba(116, 64, 232, 0.50)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        pop: "pop 0.28s ease-out",
        "cta-glow": "cta-glow 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
