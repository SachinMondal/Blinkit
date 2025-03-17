/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    theme: {
      extend: {
        colors: {
          primary: "#00A859", // Blinkit green
          secondary: "#F4F4F4", // Light gray background
          textPrimary: "#333333", // Dark text
          textSecondary: "#666666", // Lighter text
          borderColor: "#E0E0E0", // Border color
          error: "#E63946", // Red for error messages
          success: "#2ECC71", // Green for success messages
          warning: "#F39C12", // Yellow for warnings
        },
      },
    },
    plugins: [],
  }
}