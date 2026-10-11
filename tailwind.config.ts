import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: "#111113",
        elevated: "#17171A",
        border: "rgba(255,255,255,0.08)",
        "text-primary": "#F5F2EA",
        "text-secondary": "#A29C8E",
        "text-muted": "#6F6A5F",
        gold: "#D6B26A",
        "gold-from": "#EBD08F",
        "gold-to": "#B8892E",
        positive: "#5BD6A0",
        negative: "#FF6B6B",
        caution: "#F28C28",
        buy: "#5BD6A0",
        sell: "#FF6B6B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter-tight)", "Inter Tight", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Instrument Serif", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
      },
      animation: {
        "marquee": "marquee 45s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
