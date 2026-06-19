/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        v: {
          bg: '#0A0A11',
          surface: '#12121C',
          card: '#18182A',
          border: '#252545',
          accent: '#7B5CF5',
          'accent-light': '#9D87FF',
          green: '#2ECDA8',
          red: '#E85555',
          amber: '#F5A523',
          text: '#E5E3FF',
          muted: '#6866A0',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
