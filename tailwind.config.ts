import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        MARROM: "#6B3A10",
        AMARELO: "#FFC31A",
        LARANJA: "#E3A024",
        AZUL: {
          100: "#5FABD6",
          200: "#60A8D5",
          300: "#76BEDA",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
