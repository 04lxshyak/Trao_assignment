import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18201f",
        mist: "#f5f7f4",
        moss: "#5e7c65",
        coral: "#cf6f5d",
        gold: "#c49a4a"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 32, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
