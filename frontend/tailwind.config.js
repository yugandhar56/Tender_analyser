export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#EAF0FB',
        },
        teal: {
          DEFAULT: '#1A6B6B',
          light: '#E6F4F4',
        },
        orange: {
          DEFAULT: '#C45A00',
          light: '#FDF0E6',
        },
      },
    },
  },
  plugins: [],
}
