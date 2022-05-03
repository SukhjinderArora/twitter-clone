import validator from 'validator';

export const signupFormValidator = {
  validateForm1: (values) => {
    const errors = {};
    if (!values.name.trim()) {
      errors.name = 'This is a mandatory field';
    } else if (values.name.length < 2) {
      errors.name = 'Name cannot be less than 2 characters';
    } else if (values.name.length > 100) {
      errors.name = 'Name cannot be more than 100 characters';
    }
    if (!values.email.trim()) {
      errors.email = 'This is a mandatory field';
    } else if (!validator.isEmail(values.email)) {
      errors.email =
        'Email address is invalid. Please enter a valid email address.';
    }
    if (!values.month.trim()) {
      errors.month = 'This is a mandatory field';
    }
    if (!values.day.trim()) {
      errors.day = 'This is a mandatory field';
    }
    if (!values.year.trim()) {
      errors.year = 'This is a mandatory field';
    }
    return errors;
  },
  validateForm2: (values) => {
    const errors = {};
    if (!values.password.trim()) {
      errors.password = 'This is a mandatory field';
    } else if (values.password.length < 8) {
      errors.password = 'Password cannot be less than 8 characters';
    } else if (values.password.length > 16) {
      errors.password = 'Password cannot be more than 16 characters';
    }
    return errors;
  },
  validateForm3: (values) => {
    const errors = {};
    if (!values.username.trim()) {
      errors.username = 'This is a mandatory field';
    } else if (values.username.length < 3) {
      errors.username = 'Username cannot be less than 3 characters';
    } else if (values.username.length > 30) {
      errors.username = 'Username cannot be more than 30 characters';
    } else if (validator.isNumeric(values.username)) {
      errors.username = 'Username must be alphanumeric';
    } else if (validator.contains(values.username, '@')) {
      errors.username = 'Invalid username. Username must not contain @';
    }
    return errors;
  },
};

export default signupFormValidator;
