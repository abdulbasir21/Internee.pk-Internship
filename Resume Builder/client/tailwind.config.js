/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1E2A38",
          light: "#33445A",
          soft: "#5B6B7F",
        },
        paper: {
          DEFAULT: "#FAF8F4",
          raised: "#FFFFFF",
          line: "#E4E0D6",
        },
        moss: {
          DEFAULT: "#3B6E5E",
          dark: "#2C5548",
          light: "#DCEAE4",
        },
        gold: {
          DEFAULT: "#C79A3D",
          light: "#F3E7C9",
        },
        clay: {
          DEFAULT: "#B4553F",
          light: "#F6E1DB",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Source Sans 3'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,42,56,0.04), 0 8px 24px -8px rgba(30,42,56,0.12)",
        page: "0 2px 4px rgba(30,42,56,0.06), 0 24px 48px -16px rgba(30,42,56,0.22)",
        pop: "0 12px 32px -12px rgba(30,42,56,0.28)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseOnce: {
          "0%": { boxShadow: "0 0 0 0 rgba(59,110,94,0.35)" },
          "100%": { boxShadow: "0 0 0 8px rgba(59,110,94,0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.35s ease-out both",
        pulseOnce: "pulseOnce 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
