/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'Celifrut-green': '#7D9F3A',
        'Celifrut-green-dark': '#5e782b',
        'dark-primary': '#0d1117', 
      },
      boxShadow: {
        white: '2px 2px 3px 1px rgba(155, 155, 155, 0.05), 1px 1px 2px -1px rgba(155, 155, 155, 0.06)',
      },
  },
  },
  plugins: [],

}