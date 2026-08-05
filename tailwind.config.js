/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm retro CRT palette — amber gold on warm charcoal.
        bg: "#120F0D",
        panel: "#1A1613",
        panel2: "#221C18",
        line: "#2E2620",
        amber: "#FFB000",
        amberdim: "#C9A15E",
        // Single-accent palette: ember red appears ONLY in the cursor gradient
        // and its halo (see .prompt-caret / .caret-hue in globals.css).
        ember: "#FF4A3D",
        ink: "#E5D5C5",
        muted: "#8A7D70",
        muted2: "#B5A594",
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
