/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        hud: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cyan: { DEFAULT: '#00f5ff', 50: '#e0fffe', 900: '#003a3d' },
        gold: { DEFAULT: '#F5A623', dark: '#d4891a' },
        stadium: { dark: '#020205', mid: '#060d1a', light: '#0d1f38' },
      },
      animation: {
        'orbit': 'orbit 20s linear infinite',
        'orbit-rev': 'orbit-rev 15s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        orbit: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'orbit-rev': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(-360deg)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
