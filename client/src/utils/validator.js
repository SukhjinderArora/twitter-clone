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
};

export const postSignupFormValidator = {
  validateForm1: (values) => {
    const errors = {};
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

export const signinFormValidator = {
  validateForm: (values) => {
    const errors = {};
    if (!values.username.trim()) {
      errors.username = 'This is a mandatory field';
    }
    if (!values.password.trim()) {
      errors.password = 'This is a mandatory field';
    }
    return errors;
  },
};

export const newPostValidator = {
  validateForm: (values) => {
    const errors = {};
    if (!values.content.trim()) {
      errors.content = 'This is a mandatory field';
    } else if (values.content.length > 255) {
      errors.content = 'Post cannot contain more than 255 characters';
    }
    return errors;
  },
};

export const messageValidator = {
  validateForm: (values) => {
    const errors = {};
    if (!values.content.trim()) {
      errors.content = 'This is a mandatory field';
    } else if (values.content.length > 255) {
      errors.content = 'Post cannot contain more than 255 characters';
    }
    return errors;
  },
};

export const changePasswordFormValidator = {
  validateForm: (values) => {
    const errors = {};
    if (!values.currentPassword.trim()) {
      errors.currentPassword = 'This is a mandatory field';
    }

    if (!values.newPassword.trim()) {
      errors.newPassword = 'This is a mandatory field';
    } else if (values.newPassword.length < 8) {
      errors.newPassword = 'Password cannot be less than 8 characters';
    } else if (values.newPassword.length > 16) {
      errors.newPassword = 'Password cannot be more than 16 characters';
    }

    if (!values.confirmPassword.trim()) {
      errors.confirmPassword = 'This is a mandatory field';
    } else if (values.confirmPassword !== values.newPassword) {
      errors.confirmPassword = 'Confirm password does not match the password';
    }
    return errors;
  },
};

export const changeUsernameValidator = {
  validateForm: (values) => {
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

export const changeEmailValidator = {
  validateForm: (values) => {
    const errors = {};
    if (!values.email.trim()) {
      errors.email = 'This is a mandatory field';
    } else if (!validator.isEmail(values.email)) {
      errors.email =
        'Email address is invalid. Please enter a valid email address.';
    }
    return errors;
  },
};

export const ChangeBirthDateValidator = {
  validateForm: postSignupFormValidator.validateForm1,
};

export const editProfileValidator = {
  validateForm: (values) => {
    const errors = {};
    if (!values.name.trim()) {
      errors.name = 'This is a mandatory field';
    } else if (values.name.length < 2) {
      errors.name = 'Name cannot be less than 2 characters';
    } else if (values.name.length > 100) {
      errors.name = 'Name cannot be more than 100 characters';
    }
    if (values.bio.trim().length > 255) {
      errors.bio = 'Bio cannot be more than 255 characters';
    }
    if (values.website.trim() && !validator.isURL(values.website)) {
      errors.website = 'Invalid website URL';
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
    if (values.profile_image) {
      const imageMimeType = /image\/(png|jpg|jpeg)/i;
      if (!values.profile_image.type.match(imageMimeType)) {
        errors.profile_image =
          'Invalid file type. Only .jpg, .png, and .jpeg files are allowed';
      } else if (values.profile_image.size > 1024 * 1024) {
        errors.profile_image =
          'File size too large. File should be less than 1MB';
      }
    }
    return errors;
  },
};
