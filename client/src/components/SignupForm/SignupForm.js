import { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

import useForm from '../../hooks/useForm';

const validateForm1 = (values) => {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = 'This is a mandatory field';
  } else if (values.name.length < 2) {
    errors.name = 'Name cannot be less than 2 characters';
  } else if (values.name.length > 15) {
    errors.name = 'Name cannot be more than 15 characters';
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
};

const validateForm2 = (values) => {
  const errors = {};
  if (!values.password.trim()) {
    errors.password = 'This is a mandatory field';
  } else if (values.password.length < 8) {
    errors.password = 'Password cannot be less than 8 characters';
  } else if (values.password.length > 16) {
    errors.password = 'Password cannot be more than 16 characters';
  }
  return errors;
};

const validateForm3 = (values) => {
  const errors = {};
  if (!values.username.trim()) {
    errors.username = 'This is a mandatory field';
  } else if (values.username.length < 3) {
    errors.username = 'Username cannot be less than 3 characters';
  } else if (values.username.length > 15) {
    errors.username = 'Username cannot be more than 15 characters';
  } else if (validator.isNumeric(values.username)) {
    errors.username = 'Username must be alphanumeric';
  }
  return errors;
};

const validateForm4 = (values) => {
  const errors = {};
  if (!values.bio.trim()) {
    errors.bio = 'This is a mandatory field';
  }
  return errors;
};

const SignupForm = ({ closeModal }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(0);

  const form1 = useForm({
    initialValues: {
      name: '',
      email: '',
      month: '',
      day: '',
      year: '',
    },
    validate: validateForm1,
    onSubmit: () => {
      setActiveFormIndex((prevIndex) => prevIndex + 1);
    },
  });

  const form2 = useForm({
    initialValues: {
      password: '',
    },
    validate: validateForm2,
    onSubmit: () => {
      setActiveFormIndex((prevIndex) => prevIndex + 1);
    },
  });

  const form3 = useForm({
    initialValues: {
      username: '',
    },
    validate: validateForm3,
    onSubmit: () => {
      setActiveFormIndex((prevIndex) => prevIndex + 1);
    },
  });

  const form4 = useForm({
    initialValues: {
      bio: '',
    },
    validate: validateForm4,
    onSubmit: () => {
      closeModal();
    },
  });

  const renderForm = (formIndex) => {
    switch (formIndex) {
      case 0: {
        return <Form1 formData={form1} />;
      }
      case 1:
        return <Form2 formData={form2} />;
      case 2:
        return <Form3 formData={form3} />;
      case 3:
        return <Form4 formData={form4} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100%_-_70px)] w-full z-20 sm:w-[500px] sm:h-[500px] p-6">
      {renderForm(activeFormIndex)}
    </div>
  );
};

SignupForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default SignupForm;
