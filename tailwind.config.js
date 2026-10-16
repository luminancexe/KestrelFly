/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kestrel: {
          bg: "#0B1118",
          card: "rgba(16, 23, 33, 0.82)",
          cardSolid: "#101721",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
          teal: "#3CE6B8",
          tealGlow: "rgba(60, 230, 184, 0.25)",
          orange: "#FF6633",
          orangeGlow: "rgba(255, 102, 51, 0.35)",
          red: "#FF3B30",
          cream: "#E8EDF5",
          muted: "#7D8C9E",
          dark: "#080D12",
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Rajdhani"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'kestrel-glow': '0 0 24px -2px rgba(60, 230, 184, 0.35)',
        'kestrel-card': '0 16px 40px -4px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'hazard-glow': '0 0 32px 0 rgba(255, 102, 51, 0.45)',
      }
    },
  },
  plugins: [],
}
