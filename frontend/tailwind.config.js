/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        primary: { light:'#D8B4FE', DEFAULT:'#A855F7', dark:'#7E22CE' },
        secondary: { light:'#FBCFE8', DEFAULT:'#EC4899', dark:'#BE185D' },
      },
      borderRadius: { '4xl':'2rem', '5xl':'2.5rem' },
      boxShadow: { card:'0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)' },
      fontFamily: { sans:['Inter','ui-sans-serif','system-ui'] },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
