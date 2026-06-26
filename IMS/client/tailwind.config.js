/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0B14", // deepest backdrop (auth/hero pages)
          900: "#12131F", // sidebar / deep surfaces
          800: "#1B1D2D",
          700: "#272A3D",
        },
        canvas: "#F6F5FB", // main dashboard background
        brand: {
          50: "#F1EFFC",
          100: "#E4E1F8",
          400: "#7F77DD",
          500: "#6356D6", // primary accent - indigo/violet (admin)
          600: "#4F44B0",
          900: "#2A2570",
        },
        teal: {
          50: "#ECFBF5",
          400: "#5DCAA5",
          500: "#1D9E75", // secondary accent (intern)
          600: "#157A5B",
        },
        accent: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          400: "#F0A23A",
          500: "#D97706", // warm accent - used sparingly for "pending" state
          600: "#B45F04",
        },
        good: {
          50: "#ECFBF5",
          500: "#16A34A",
          600: "#15803D",
        },
        bad: {
          50: "#FDF1F1",
          500: "#E0504F",
          600: "#C23B3A",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Lexend", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,18,21,0.04), 0 1px 8px rgba(16,18,21,0.04)",
        glow: "0 0 0 1px rgba(99,86,217,0.12), 0 12px 32px -8px rgba(99,86,217,0.28)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
