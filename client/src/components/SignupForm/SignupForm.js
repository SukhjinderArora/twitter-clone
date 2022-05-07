import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Form1 from './Form1';
import Form2 from './Form2';

import useForm from '../../hooks/useForm';
import { useAuth } from '../../contexts/auth-context';

import { signupFormValidator } from '../../utils/validator';

const SignupForm = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(0);
  const [userData, setUserData] = useState({
    user: null,
  });
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const { validateForm1, validateForm2 } = signupFormValidator;

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
            login(
              response.data.user,
              response.data.accessToken,
              response.data.expiresAt
            );
            navigate('success');
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
        return <Form1 formData={form1} isLoading={validateEmail.isLoading} />;
      case 1:
        return <Form2 formData={form2} isLoading={createUser.isLoading} />;
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

export default SignupForm;
