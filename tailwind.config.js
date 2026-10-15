/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // RonDesignLab "Raktor" Official Palette
        raktor: {
          bg: "#06080C",
          surface: "#0D1118",
          card: "rgba(14, 18, 26, 0.82)",
          cardHover: "rgba(20, 26, 38, 0.95)",
          border: "rgba(255, 255, 255, 0.07)",
          borderHover: "rgba(255, 255, 255, 0.15)",
          borderOrange: "rgba(234, 88, 12, 0.35)",
          
          // Accent Tones: Warm Cream & Rust/Burnt Orange
          cream: "#FCF4EA",
          creamMuted: "#C5BCB2",
          creamDark: "#857D74",
          
          orange: "#EA580C",
          orangeBright: "#F97316",
          orangeGlow: "rgba(234, 88, 12, 0.25)",
          orangeDark: "#9A3412",

          // Operational Status Indicators
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
          cyan: "#38BDF8",
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Rajdhani"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'raktor-card': '0 12px 32px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'raktor-glow': '0 0 24px -2px rgba(234, 88, 12, 0.35)',
        'raktor-dock': '0 16px 40px -6px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
