/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      fontFamily: {
        'ogg': ['Ogg Roman', 'Playfair Display', 'Georgia', 'serif'],
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
        'sofia': ['Sofia Pro', 'Source Sans 3', 'system-ui', 'sans-serif'],
        'sans': ['Sofia Pro', 'Source Sans 3', 'system-ui', 'sans-serif'],
        'neue': ['Sofia Pro', 'Source Sans 3', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '2rem',
          lg: '2rem',
          xl: '2rem',
        },
      },
    },
  },
  plugins: [],
};
