import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const validateEmail = useMutation(({ email, name }) => {
    return axios.post('/api/auth/signup/validate-email', {
      email,
      name,
    });
  });

  const createUser = useMutation(({ email, name, password }) => {
    return axios.post('/api/auth/signup/create-user', {
      email,
      name,
      password,
    });
  });

  const updateUsername = useMutation(({ userId, username }) => {
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
    },
    validate: validateForm1,
    onSubmit: async (values) => {
      const user = {
        email: values.email,
        name: values.name,
      };
      setUserData({ user });
      validateEmail.mutate(user, {
        onSuccess: () => {
          setActiveFormIndex((prevIndex) => prevIndex + 1);
        },
        onError: (err) => {
          const error = err.response.data.errors || err.response.data.error;
          if (Array.isArray(error)) {
            const errors = error.reduce((acc, cur) => {
              acc[cur.param] = cur.msg;
              return acc;
            }, {});
            form1.setMultipleFieldsError(errors);
          }
        },
      });
    },
  });

  const form2 = useForm({
    initialValues: {
      password: '',
    },
    validate: validateForm2,
    onSubmit: async (values) => {
      createUser.mutate(
        {
          email: userData.user.email,
          name: userData.user.name,
          password: values.password,
        },
        {
          onSuccess: (response) => {
            setUserData({
              user: response.data.user,
              token: response.data.accessToken,
              expiresAt: response.data.expiresAt,
            });
            navigate('success', {
              state: {
                user: response.data.user,
                token: response.data.accessToken,
                expiresAt: response.data.expiresAt,
              },
            });
          },
          onError: (err) => {
            const error = err.response.data.errors || err.response.data.error;
            if (Array.isArray(error)) {
              const errors = error.reduce((acc, cur) => {
                acc[cur.param] = cur.msg;
                return acc;
              }, {});
              form2.setMultipleFieldsError(errors);
            }
          },
        }
      );
    },
  });

  const form3 = useForm({
    initialValues: {
      username: '',
    },
    validate: validateForm3,
    onSubmit: (values) => {
      updateUsername.mutate(
        {
          userId: userData.user.id,
          username: values.username,
        },
        {
          onSuccess: (response) => {
            setActiveFormIndex((prevIndex) => prevIndex + 1);
            login(response.data.user, userData.token, userData.expiresAt);
            closeModal();
          },
          onError: (err) => {
            const error = err.response.data.errors || err.response.data.error;
            if (Array.isArray(error)) {
              const errors = error.reduce((acc, cur) => {
                acc[cur.param] = cur.msg;
                return acc;
              }, {});
              form3.setMultipleFieldsError(errors);
            }
          },
        }
      );
    },
  });

  const renderForm = (formIndex) => {
    switch (formIndex) {
      case 0:
        return <Form1 formData={form1} isLoading={validateEmail.isLoading} />;
      case 1:
        return <Form2 formData={form2} isLoading={createUser.isLoading} />;
      case 2:
        return <Form3 formData={form3} isLoading={updateUsername.isLoading} />;
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
