/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0F172A", // sidebar / nav / dark surfaces
          700: "#1E293B",
          500: "#475569",
        },
        canvas: "#FAFAF8", // warm off-white page background
        brand: {
          DEFAULT: "#0D9488", // primary accent (teal) -- not default indigo
          dark: "#0F766E",
          light: "#CCFBF1",
        },
        warn: {
          DEFAULT: "#D97706", // pending / amber
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626", // overdue / errors only
          light: "#FEE2E2",
        },
        success: {
          DEFAULT: "#15803D",
          light: "#DCFCE7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontFeatureSettings: {
        tabular: '"tnum"',
      },
    },
  },
  plugins: [],
};
