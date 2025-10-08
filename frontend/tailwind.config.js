/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rural India Theme - Warm, Organic Colors
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Base red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          maroon: '#8B1538', // Deep maroon
          pink: '#E91E63', // Earthy pink
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15', // Turmeric yellow
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        accent: {
          green: '#4CAF50', // Leaf green
          skyblue: '#03A9F4', // Sky blue
          orange: '#FF9800', // Warm orange
        },
        neutral: {
          cream: '#FAF7F2',
          beige: '#F5F1E8',
          offwhite: '#FDFBF7',
          charcoal: '#3E3E3E',
          brown: '#5D4E37',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
