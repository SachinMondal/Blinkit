/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 10s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      colors: {
        primary: "#00A859", 
        secondary: "#F4F4F4", 
        textPrimary: "#333333",
        textSecondary: "#666666",
        borderColor: "#E0E0E0", 
        error: "#E63946", 
        success: "#2ECC71",
        warning: "#F39C12",
      },
    },
  },
  plugins: [],
};
