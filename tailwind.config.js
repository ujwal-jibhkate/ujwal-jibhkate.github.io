/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FBF9F3',
        ink: '#14120E',
        soft: '#5C574E',
        faint: '#6E6A5E',
        hairline: '#D8D2C2',
        mark: '#A8321E',
        accent: '#2E5C7A',
        rule: '#14120E',
        wash: '#F2EEE2',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Source Serif Fallback"', 'Georgia', 'serif'],
        mono: ['"iA Writer Quattro"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
