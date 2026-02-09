/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


module.exports = {
  theme: {
    extend: {
      // foco sea invisible
      ringColor: {
        DEFAULT: 'transparent',
      }
    },
  },
}