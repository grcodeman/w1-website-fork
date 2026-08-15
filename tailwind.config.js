/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wmu-brown': '#6C4023',
        'wmu-gold': '#B5A167',
        'cream': '#FAF7F2',
        'warm-white': '#FEFCF9',
        'brown-deep': '#3A2213',
        'text-primary': '#2C1810',
        'text-secondary': '#6B5C52',
        'text-on-dark': '#FAF7F2',
        'gold-bright': '#D4A843',
        'gold-deep': '#8A6D15',
        'gold-subtle': '#E8D5A3',
        'border': '#E5DDD3',
        'hover-bg': '#F2EDE5',
      },
      fontFamily: {
        'serif': ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
