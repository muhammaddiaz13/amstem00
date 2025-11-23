/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Vite uses this in the public directory by default, but it's good to include.
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}