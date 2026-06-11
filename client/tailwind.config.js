/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        night: {
          50: "#f0f0f5",
          100: "#d0d0e0",
          200: "#a0a0c0",
          300: "#7070a0",
          400: "#404070",
          500: "#1a1a2e",
          600: "#16162a",
          700: "#121224",
          800: "#0e0e1e",
          900: "#0a0a18",
        },
        electric: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        neon: {
          green: "#39ff14",
          cyan: "#00f5ff",
          pink: "#ff006e",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        blink: { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0 } },
      },
    },
  },
  plugins: [],
};
