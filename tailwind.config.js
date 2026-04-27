/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand (legacy `mnd.*` kept for backward compatibility)
        mnd: {
          green: "#00A651",
          "green-dark": "#008C45",
          "green-light": "#E8F5E9",
          dark: "#0F172A",
          gray: "#64748B",
          "gray-light": "#F5F7F8",
          red: "#EF4444",
          orange: "#F59E0B",
          blue: "#3B82F6",
        },
        // Semantic surface / text aliases
        surface: {
          DEFAULT: "#F5F7F8",
          card: "#FFFFFF",
          subtle: "#F3F4F6",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        line: {
          DEFAULT: "#E5E7EB",
          subtle: "#F1F2F4",
        },
        // Tone colors (background usage — use *-text for foreground)
        success: { DEFAULT: "#10B981", bg: "#E8F5E9", text: "#067647" },
        warning: { DEFAULT: "#F59E0B", bg: "#FEF3C7", text: "#B45309" },
        danger:  { DEFAULT: "#EF4444", bg: "#FEE2E2", text: "#B91C1C" },
        info:    { DEFAULT: "#3B82F6", bg: "#DBEAFE", text: "#1D4ED8" },
      },
      fontFamily: {
        sans: ["System"],
      },
      fontSize: {
        // Predictable scale — replaces ad-hoc text-[10px] etc.
        "2xs": ["11px", { lineHeight: "14px" }],
        xs:   ["12px", { lineHeight: "16px" }],
        sm:   ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "22px" }],
        lg:   ["18px", { lineHeight: "24px" }],
        xl:   ["20px", { lineHeight: "26px" }],
        "2xl":["24px", { lineHeight: "30px" }],
        "3xl":["30px", { lineHeight: "36px" }],
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
};

