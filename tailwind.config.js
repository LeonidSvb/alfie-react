/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'alfie-light-green': '#E8F5E8',
        'alfie-dark-green': '#2D5A2D',
        'alfie-orange': '#FF8C42',
        'alfie-button-green': '#4CAF50',
        'alfie-button-hover': '#45a049'
      },
      borderRadius: {
        '12': '12px',
        '16': '16px',  
        '18': '18px',
        '20': '20px',
        '24': '24px',
        '28': '28px'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}