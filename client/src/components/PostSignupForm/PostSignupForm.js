import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Form1 from './Form1';
import Form2 from './Form2';

import useForm from '../../hooks/useForm';

import { postSignupFormValidator } from '../../utils/validator';
import { useAuth } from '../../contexts/auth-context';

const PostSignupForm = ({ closeModal }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(0);
  const { validateForm1, validateForm2 } = postSignupFormValidator;
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const { token, expiresAt } = state;

  const updateDOB = useMutation(({ dateOfBirth }) => {
    return axios.patch(
      '/api/auth/signup/update-dob',
      {
        dateOfBirth,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });

  const updateUsername = useMutation(({ username }) => {
    return axios.patch(
      '/api/auth/signup/update-username',
      {
        username,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });

  const form1 = useForm({
    initialValues: {
      month: '',
      day: '',
      year: '',
    },
    validate: validateForm1,
    onSubmit: (values) => {
      updateDOB.mutate(
        {
          dateOfBirth: new Date(
            `${values.year}/${values.month}/${values.day}`
          ).toISOString(),
        },
        {
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
        }
      );
    },
  });
  const form2 = useForm({
    initialValues: {
      username: '',
    },
    validate: validateForm2,
    onSubmit: (values) => {
      updateUsername.mutate(
        {
          username: values.username,
        },
        {
          onSuccess: (response) => {
            login(response.data.user, token, expiresAt);
            closeModal();
            navigate('/');
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
  const renderForm = (formIndex) => {
    switch (formIndex) {
      case 0:
        return <Form1 formData={form1} />;
      case 1:
        return <Form2 formData={form2} />;
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

PostSignupForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default PostSignupForm;
