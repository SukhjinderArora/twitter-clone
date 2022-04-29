module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      lato: ['Lato', 'sans-serif'],
      raleway: ['Raleway', 'sans-serif'],
      verdana: ['verdana', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        error: 'var(--error)',
        'on-primary': 'var(--on-primary)',
        'on-background': 'var(--on-background)',
        'on-surface': 'var(--on-surface)',
        'on-error': 'var(--on-error)',
      },
    },
  },
  plugins: [],
};
