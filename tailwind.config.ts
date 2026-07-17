import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // AERO Fitness brand palette — teal & navy
        aero: {
          50: "#effcfa", // light teal page background
          100: "#d7f6f2",
          200: "#b0ede6",
          300: "#7cddd5",
          400: "#43c4bd",
          500: "#26a8a3", // primary teal
          600: "#1c8784",
          700: "#1a6c6b",
          800: "#195656",
          900: "#0f3d40",
        },
        navy: {
          700: "#16324f",
          800: "#102640", // dark teal/navy accent
          900: "#0b1a2e",
        },
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(15, 61, 64, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
