/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#146ead',
          dark: '#00558a',
          light: '#cfe5ff',
          container: '#deecff',
        },
        secondary: {
          DEFAULT: '#fc8f34',
          dark: '#944a00',
          light: '#ffdcc5',
        },
        surface: {
          DEFAULT: '#faf8fe',
          dim: '#dad9df',
          container: '#eeedf3',
          'container-high': '#e9e7ed',
          'container-low': '#f4f3f8',
          'container-lowest': '#ffffff',
        },
        'on-surface': '#1a1b1f',
        'on-surface-variant': '#404750',
        outline: '#717881',
        'outline-variant': '#c0c7d1',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      fontFamily: {
        'slabo': ['"Slabo 27px"', 'serif'],
        'public-sans': ['"Public Sans"', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        'brand': '4px',
      },
    },
  },
  plugins: [],
}
