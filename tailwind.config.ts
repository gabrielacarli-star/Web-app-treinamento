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
          50: "#F3EEFF",
          100: "#E4D8FF",
          300: "#B79BFF",
          400: "#9061FF",
          500: "#7C2DFF",
          600: "#6A15F0",
          700: "#5407C9",
        },
        coral: { 100: "#FFE3D6", 300: "#FF9264", 500: "#FF4E17", 600: "#EA3C05" },
        teal: { 100: "#C8FBEE", 500: "#00D9A6", 600: "#00B98C" },
        gold: { 300: "#FFE47A", 500: "#FFC419", 600: "#EBAA00" },
        pink: { 100: "#FFD9EC", 500: "#FF2D87" },
        sky: { 100: "#D2ECFF", 500: "#0FA3FF" },
        sun: "#FFE81F",
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
        /* Brightness and glow only. Scaling the button would keep moving the
           tap target under the user's thumb across a 19-step quiz. */
        "cta-blink": {
          "0%, 100%": {
            boxShadow: "0 8px 22px rgba(124, 45, 255, 0.32)",
            filter: "brightness(1) saturate(1)",
          },
          "50%": {
            boxShadow: "0 12px 40px rgba(124, 45, 255, 0.68)",
            filter: "brightness(1.16) saturate(1.15)",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-140%)" },
          "100%": { transform: "translateX(240%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        pop: "pop 0.28s ease-out",
        "cta-blink": "cta-blink 1.5s ease-in-out infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
