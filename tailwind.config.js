/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ══ Tamanos de fuente vinculados a variables CSS ══
         Cada entrada usa: [tamano, { lineHeight, fontWeight }]
         para que las clases apliquen todo el combo.            */
      fontFamily: {
        "display": "var(--font-display)",
        "heading": "var(--font-heading)",
        "body": "var(--font-body)",
        "ui": "var(--font-ui)",
        "mono": "var(--font-mono)",
      },
      fontSize: {
        "display": ["var(--font-size-display)", { lineHeight: "var(--line-height-tight)" }],
        "h1": ["var(--font-size-h1)", { lineHeight: "var(--line-height-tight)" }],
        "h2": ["var(--font-size-h2)", { lineHeight: "var(--line-height-snug)" }],
        "h3": ["var(--font-size-h3)", { lineHeight: "var(--line-height-snug)" }],
        "body": ["var(--font-size-body)", { lineHeight: "var(--line-height-relaxed)" }],
        "small": ["var(--font-size-small)", { lineHeight: "var(--line-height-normal)" }],
        "caption": ["var(--font-size-caption)", { lineHeight: "var(--line-height-normal)" }],
        "badge": ["var(--font-size-badge)", { lineHeight: "var(--line-height-normal)" }],
        "micro": ["var(--font-size-micro)", { lineHeight: "var(--line-height-normal)" }],
      },
      fontWeight: {
        "light": "var(--font-weight-light)",
        "normal": "var(--font-weight-normal)",
        "medium": "var(--font-weight-medium)",
        "semibold": "var(--font-weight-semibold)",
        "bold": "var(--font-weight-bold)",
      },
      letterSpacing: {
        "tight": "var(--tracking-tight)",
        "normal": "var(--tracking-normal)",
        "wide": "var(--tracking-wide)",
        "wider": "var(--tracking-wider)",
        "widest": "var(--tracking-widest)",
      },
    },
  },
  plugins: [],
}