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
        background: "#0B0E11",
        secondary: "#11151A",
        panel: "#161A1F",
        "panel-hover": "#1C2128",
        border: "#2A3038",
        "border-light": "#363D47",
        foreground: "#EAECEF",
        "text-secondary": "#848E9C",
        muted: "#5E6673",
        buy: "#0ECB81",
        sell: "#F6465D",
        positive: "#0ECB81",
        negative: "#F6465D",
        accent: "#F0B90B",
        gold: "#F0B90B",
        "gold-hover": "#F8D33A",
        blue: "#3861FB",
        "blue-hover": "#4C71FC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "'Roboto Mono'", "Menlo", "monospace"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "flash-green": "flashGreen 0.8s ease-out",
        "flash-red": "flashRed 0.8s ease-out",
        "ticker": "ticker 35s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        flashGreen: {
          "0%": { backgroundColor: "rgba(14, 203, 129, 0.35)", color: "#0ECB81" },
          "100%": { backgroundColor: "transparent" },
        },
        flashRed: {
          "0%": { backgroundColor: "rgba(246, 70, 93, 0.35)", color: "#F6465D" },
          "100%": { backgroundColor: "transparent" },
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
