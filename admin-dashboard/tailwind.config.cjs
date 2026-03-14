/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050316",
        foreground: "#F9FAFB",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#F9FAFB"
        },
        muted: {
          DEFAULT: "#111827",
          foreground: "#9CA3AF"
        },
        card: {
          DEFAULT: "#0B061F",
          foreground: "#E5E7EB"
        }
      },
      borderRadius: {
        xl: "1.25rem"
      }
    }
  },
  plugins: []
};

