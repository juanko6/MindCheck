/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // 👈 activamos modo oscuro basado en clase
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          shimmer: 'shimmer 1.5s infinite linear',
        },
        keyframes: {
          shimmer: {
            '0%': { backgroundPosition: '-1000px 0' },
            '100%': { backgroundPosition: '1000px 0' },
          },
        },
        backgroundImage: {
          shimmer: 'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
        },
        backgroundSize: {
          shimmer: '200% 100%',
        },
      },
    },
    plugins: [],
  }