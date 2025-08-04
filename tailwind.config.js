/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'red-health': {
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFEEEE',
          300: '#FFCCCC',
          400: '#FF9999',
          500: '#FF0000',
          600: '#E60000',
          700: '#CC0000',
          800: '#990000',
          900: '#660000',
        },
      },
    },
  },
  plugins: [],
};