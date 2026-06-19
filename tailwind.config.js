/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36a8f8',
          500: '#0c8ae9',
          600: '#006cc7',
          700: '#0156a1',
          800: '#064984',
          900: '#0b3e6e',
        },
        ink: '#0f172a',
        canvas: '#fafafa',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        lift: '0 8px 24px rgba(0,108,199,0.15)',
      },
    },
  },
  plugins: [],
}
