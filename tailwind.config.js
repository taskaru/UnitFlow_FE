/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,pug}"],
  theme: {
    extend: {
      colors: {
        'space-gray': '#8E8E93'
      }
    },
  },
  plugins: [],
};
