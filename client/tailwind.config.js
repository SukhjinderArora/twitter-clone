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
      roboto: ['Roboto', 'sans-serif'],
    },
    extend: {
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
    },
  },
  plugins: [],
};
