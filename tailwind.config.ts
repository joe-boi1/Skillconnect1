import type { Config } from "tailwindcss";

// SkillConnect design tokens
// Palette: deep "artisan green" for trust/growth, a warm signal amber for
// craftsmanship/tools, and an ink/paper neutral pair. Chosen to read as a
// professional Nigerian services marketplace — not a generic SaaS template.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12201B",        // near-black, green-tinted — primary text
        paper: "#F7F6F2",      // warm off-white background
        brand: {
          50: "#EAF5EF",
          100: "#CFE9DA",
          200: "#9FD3B5",
          300: "#6EBB92",
          400: "#3E9F6F",
          500: "#0B6E4F",      // primary brand green
          600: "#095B41",
          700: "#084A35",
          800: "#06392A",
          900: "#042A1F",
        },
        amber: {
          50: "#FEF6E7",
          100: "#FCE7BE",
          400: "#F2A93B",      // accent — used sparingly (CTAs, ratings)
          500: "#E3941E",
          600: "#B87516",
        },
        coral: {
          50: "#FDEDEB",
          400: "#E2574C",      // errors / destructive actions
          500: "#C7392D",
        },
        line: "#E4E1D8",       // hairline borders on paper
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,32,27,0.06), 0 8px 24px -12px rgba(18,32,27,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
