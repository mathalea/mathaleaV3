const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      scale: {
        175: '1.75',
        200: '2.00'
      },
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
          darkmodelight: '#363633',
          canvas: {
            DEFAULT: '#EDEDF0',
            dark: '#e1e1e6',
            darkest: '#d6d6db'
          },
          corpus: {
            DEFAULT: '#1F2429',
            light: '#45505b',
            lightest: '#6a7c8d',
            dark: '#191d21',
            darkest: '#131619'
          },
          action: {
            DEFAULT: '#F15929',
            light: '#f47a54',
            lightest: '#f79b7f',
            dark: '#d43d0e',
            darkest: '#9f2e0a'
          },
          warn: {
            DEFAULT: '#80D925',
            light: '#99e150',
            lightest: '#b3e97c',
            dark: '#66ae1e',
            darkest: '#4d8216'
          },
          struct: {
            DEFAULT: '#216D9A',
            light: '#2c93cf',
            lightest: '#5faedd',
            dark: '#1a577b',
            darkest: '#14415c'
          }
        },
        coopmathsdark: {
          DEFAULT: '#F15929',
          lightest: '#f87f5c',
          light: '#f56d45',
          dark: '#F45E27',
          darkest: '#E64A10',
          back: '#2e2e2b',
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
          darkmodelight: '#363633',
          canvas: {
            DEFAULT: '#282a36',
            dark: '#3a3d4e',
            darkest: '#4b4f66',
            light: '#9fa3b8'
          },
          corpus: {
            DEFAULT: '#b0b0b0',
            light: '#c8c8c8',
            lightest: '#dfdfdf',
            dark: '#7b7b7b',
            darkest: '#464646'
          },
          action: {
            DEFAULT: '#ffb86c',
            light: '#ffc689',
            lightest: '#ffd4a7',
            dark: '#ff9523',
            darkest: '#da7100'
          },
          warn: {
            DEFAULT: '#ff79c6',
            light: '#ff94d1',
            lightest: '#ffafdd',
            dark: '#ff2ea6',
            darkest: '#e20082'
          },
          struct: {
            DEFAULT: '#bd93f9',
            light: '#c49efa',
            lightest: '#caa9fa',
            dark: '#a66df7',
            darkest: '#8f48f5'
          }
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
          secondary: '#216D9A',
          accent: '#D84010',
          neutral: '#e1e1e6',
          'base-100': '#FFFF',
          info: '#bd93f9',
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
