/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['*.html'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--warna-tema)/ <alpha-value>)',
      },
    },
  },
  plugins: [],
};
