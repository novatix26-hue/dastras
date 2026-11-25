import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        portal: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          primary: "#065F46",
          primaryHover: "#047857",
          primaryLight: "#ECFDF5",
          slate: "#0F172A",
          muted: "#475569",
          border: "#E2E8F0",
          gold: "#D97706",
          goldLight: "#FEF3C7",
        },
      },
      fontFamily: {
        nastaleeq: [
          "Jameel Noori Nastaleeq",
          "Noto Nastaliq Urdu",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
