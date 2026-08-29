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
          100: "#EFE9FD",
          300: "#C9B8F7",
          400: "#A48BF0",
          500: "#9478EA",
          600: "#8B6EE5",
          700: "#7357CE",
        },
        coral: { 100: "#FDE9E2", 300: "#F9A98F", 500: "#F2724F", 600: "#DE5D3A" },
        teal: { 100: "#DCF2EE", 500: "#4FBFAE", 600: "#3AA697" },
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
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
