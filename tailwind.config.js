const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/@heroui/theme/dist/components/modal.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}

