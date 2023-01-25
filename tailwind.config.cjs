const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        coopmaths: {
          DEFAULT: '#F15929',
          lightest: '#FFE6D6',
          light: '#FF7343',
          dark: '#D84010',
          darkest: '#BE2600',
          back: '#FFFBE8',
          backdark: '#E0E6CC',
          backdarker: '#D7DCC4',
          backcorrection: '#FFE6D6',
          backnav: '#F15929',
          backnavlight: '#FF7343',
          title: '#4A4737',
          titlemenu: '#F15929',
          titlelight: '#FFFBE8',
          titleexercise: '#F15929',
          darkmode: '#2e2e2b',
          darkmodelight: '#363633'
        }
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', ...defaultTheme.fontFamily.sans],
        logo1: 'neoretrodrawregular',
        logo2: 'geometry_soft_probold_n',
        logo3: '"Fredoka One"',
        logo4: '"Bebas Neue"',
        logo5: '"Frente H1"',
        logo6: 'colortuberegular',
        logo7: '"Cabin Sketch"',
        logo8: '"Fredericka the Great"',
        logo9: 'jelleebold',
        logo10: '"League Gothic Condensed"',
        logo11: '"FFF Tusj"',
        logo12: 'Days'
      },
      transitionProperty: {
        width: 'width'
      }
    }
  },
  variants: {
    display: ['group-hover']
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#F15929',
          secondary: '#FF8C5C',
          accent: '#D84010',
          neutral: '#E0E6CC',
          'base-100': '#FFFF',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272'
        }
      }
    ]
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
