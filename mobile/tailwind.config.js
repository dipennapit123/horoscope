/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050316",
        surface: "#0B061F",
        surfaceMuted: "#100826",
        primary: "#7C3AED",
        primarySoft: "#A855F7",
        text: "#F9FAFB",
        textMuted: "#9CA3AF",
        cardBorder: "rgba(167, 139, 250, 0.35)",
      },
      fontFamily: {
        funky: "Poppins_400Regular",
        "funky-semibold": "Poppins_600SemiBold",
        "funky-bold": "Poppins_700Bold",
      },
    },
  },
  plugins: [],
};
