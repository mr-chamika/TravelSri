/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      colors: {

        primary: 'blue',

        light: {

          100: 'yellow',
          200: 'green',
          300: 'red'

        }

      }

    },
  },
  plugins: [],
}

