import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#e1e0de",
        primary: "#161616",
        darkPrimary: "#D4D4D4",
        darkBg: "#171717",
        darkSecondary: "#A3A3A3",
      },
      fontFamily: {
        overpass: ["Overpass", "system-ui", "Arial"],
        spectral: ["Spectral", "sans-serif"],
        inter: ["Inter", "system-ui", "Arial"],
        inter_tight: ["Inter Tight", "system-ui", "Arial"],
        kurale: ["Kurale", "serif"],
        kreon: ["Kreon", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
export default config;
