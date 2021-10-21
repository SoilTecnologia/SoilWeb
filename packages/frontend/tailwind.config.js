module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#4A6E53',
      'secondary': '#E3EBC6',
    }),
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'serif': ['Syncopate', 'serif']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
