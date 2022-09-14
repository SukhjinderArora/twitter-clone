function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      verdana: ['verdana', 'sans-serif'],
      'source-sans-pro': ['Source Sans Pro', 'sans-serif'],
    },
    extend: {
      minHeight: (theme) => ({ ...theme('spacing') }),
      minWidth: (theme) => ({ ...theme('spacing') }),
      colors: {
        primary: withOpacityValue('--primary'),
        'primary-light': withOpacityValue('--primary-light'),
        'primary-dark': withOpacityValue('--primary-dark'),
        background: withOpacityValue('--background'),
        surface: withOpacityValue('--surface'),
        error: withOpacityValue('--error'),
        'on-primary': withOpacityValue('--on-primary'),
        'on-background': withOpacityValue('--on-background'),
        'on-surface': withOpacityValue('--on-surface'),
        'on-error': withOpacityValue('--on-error'),
      },
      animation: {
        enter: 'enter 200ms ease-out forwards',
        leave: 'leave 200ms ease-out forwards',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        leave: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
