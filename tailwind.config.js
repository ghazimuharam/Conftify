module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge:{
    enabled: false,
    content: [
      './views/*.ejs',
      './public/assets/script.js',
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins'],
      },
      colors: {
        app: {
          'light': '#EAEFF7',
          'gray': '#B6AFAB',
          'dark': '#100908',
          'yellow': '#EBB23C',
          'red': '#e51515',
          'menuActive': '#2c2a2e',
        }
      },
      borderRadius: {
        'menu':'1rem',
        'content':'3rem',
      }
    },
  },
  variants: {},
  plugins: [],
}
