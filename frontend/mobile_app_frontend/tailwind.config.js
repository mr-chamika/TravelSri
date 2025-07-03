/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  "./app/(guides)/**/*.{js,jsx,ts,tsx}",  // ✅ Include route group
    "./app/views/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

    },
  },
  plugins: [],
}

