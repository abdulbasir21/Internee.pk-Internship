/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3F5F7",
        ink: "#101B27",
        blueprint: {
          DEFAULT: "#2C5F8A",
          light: "#5B87AC",
          dark: "#1C4062",
        },
        brass: {
          DEFAULT: "#C68B3D",
          light: "#DDA85F",
          dark: "#9C6B29",
        },
        line: "#C7D0D9",
        sage: "#4C7A63",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Public Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(#C7D0D9 1px, transparent 1px), linear-gradient(90deg, #C7D0D9 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      boxShadow: {
        spec: "4px 4px 0 0 #101B27",
        "spec-sm": "3px 3px 0 0 #101B27",
      },
    },
  },
  plugins: [],
};
