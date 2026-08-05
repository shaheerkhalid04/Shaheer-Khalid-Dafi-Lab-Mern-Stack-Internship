/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#101010",
        panel2: "#141414",
        line: "#1e1e1e",
        green: "#00ff9c",
        greendim: "#7fd8b8",
        red: "#ff2b4a",
        reddim: "#ff7a8f",
        ink: "#f5f5f0",
        muted: "#8a8a85",
        muted2: "#b0b0aa",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      keyframes: {
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
