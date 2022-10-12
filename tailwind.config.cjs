const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        coopmaths: {
          DEFAULT: '#F15929',
          lightest: '#FF8C5C',
          light: '#FF7343',
          dark: '#D84010',
          darkest: '#BE2600'
        }
      },

      fontFamily: {
        sans: ['"Source Sans Pro"', ...defaultTheme.fontFamily.sans],
        beba: '"Bebas Neue"'
      },
      transitionProperty: {
        width: 'width'
      }
    }
  },
  variants: {
    display: ['group-hover']
  },
  plugins: [
    require('daisyui'),
    // Pour les tooltips
    require('@tailwindcss/forms'),
    // Pour ???
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    })
  ]
}

module.exports = config
