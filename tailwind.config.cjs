const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        coopmaths: {
          DEFAULT: '#F15929',
          lightest: '#f87f5c',
          light: '#f56d45',
          dark: '#F45E27',
          darkest: '#E64A10',
          back: '#f5f1f3',
          backdark: '#dadbdf',
          backdarker: '#cecfd4',
          backcorrection: '#E0A588',
          backnav: '#F15929',
          backnavlight: '#f56d45',
          title: '#342A34',
          titlemenu: '#F15929',
          titlelight: '#f5f1f3',
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
          neutral: '#dadbdf',
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
