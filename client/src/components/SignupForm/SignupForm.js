import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import axios from 'axios';

import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';

import useForm from '../../hooks/useForm';
import { useAuth } from '../../contexts/auth-context';

import { signupFormValidator } from '../../utils/validator';

const SignupForm = ({ closeModal }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(0);
  const [userData, setUserData] = useState({
    user: null,
    token: null,
    expiresAt: null,
  });
  const { login } = useAuth();

  const mutation1 = useMutation(({ email, name, dateOfBirth }) => {
    return axios.post('/api/auth/signup/validate-email', {
      email,
      name,
      dateOfBirth,
    });
  });

  const mutation2 = useMutation(({ email, name, dateOfBirth, password }) => {
    return axios.post('/api/auth/signup/create-user', {
      email,
      name,
      dateOfBirth,
      password,
    });
  });

  const mutation3 = useMutation(({ userId, username }) => {
    return axios.patch(
      '/api/auth/signup/update-username',
      {
        userId,
        username,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    );
  });

  const { validateForm1, validateForm2, validateForm3 } = signupFormValidator;

  const form1 = useForm({
    initialValues: {
      name: '',
      email: '',
      month: '',
      day: '',
      year: '',
    },
    validate: validateForm1,
    onSubmit: async (values) => {
      try {
        const user = {
          email: values.email,
          name: values.name,
          dateOfBirth: new Date(
            `${values.year}/${values.month}/${values.day}`
          ).toISOString(),
        };
        setUserData({ user });
        await mutation1.mutateAsync(user);
        setActiveFormIndex((prevIndex) => prevIndex + 1);
      } catch (err) {
        const error = err.response.data.errors || err.response.data.error;
        if (Array.isArray(error)) {
          const errors = error.reduce((acc, cur) => {
            acc[cur.param] = cur.msg;
            return acc;
          }, {});
          form1.setMultipleFieldsError(errors);
        }
      }
    },
  });

  const form2 = useForm({
    initialValues: {
      password: '',
    },
    validate: validateForm2,
    onSubmit: async (values) => {
      try {
        const response = await mutation2.mutateAsync({
          email: userData.user.email,
          name: userData.user.name,
          dateOfBirth: userData.user.dateOfBirth,
          password: values.password,
        });
        setActiveFormIndex((prevIndex) => prevIndex + 1);
        setUserData({
          user: response.data.user,
          token: response.data.accessToken,
          expiresAt: response.data.expiresAt,
        });
      } catch (err) {
        const error = err.response.data.errors || err.response.data.error;
        if (Array.isArray(error)) {
          const errors = error.reduce((acc, cur) => {
            acc[cur.param] = cur.msg;
            return acc;
          }, {});
          form2.setMultipleFieldsError(errors);
        }
      }
    },
  });

  const form3 = useForm({
    initialValues: {
      username: '',
    },
    validate: validateForm3,
    onSubmit: async (values) => {
      try {
        const response = await mutation3.mutateAsync({
          userId: userData.user.id,
          username: values.username,
        });
        setActiveFormIndex((prevIndex) => prevIndex + 1);
        login(response.data.user, userData.token, userData.expiresAt);
        closeModal();
      } catch (err) {
        const error = err.response.data.errors || err.response.data.error;
        if (Array.isArray(error)) {
          const errors = error.reduce((acc, cur) => {
            acc[cur.param] = cur.msg;
            return acc;
          }, {});
          form3.setMultipleFieldsError(errors);
        }
      }
    },
  });

  const renderForm = (formIndex) => {
    switch (formIndex) {
      case 0:
        return <Form1 formData={form1} isLoading={mutation1.isLoading} />;
      case 1:
        return <Form2 formData={form2} isLoading={mutation2.isLoading} />;
      case 2:
        return <Form3 formData={form3} isLoading={mutation3.isLoading} />;
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
