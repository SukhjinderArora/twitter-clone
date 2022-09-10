/* eslint-disable react/jsx-no-constructed-context-values */
import { RiArrowLeftLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

import useForm from '../../hooks/useForm';
import { useAuth } from '../../contexts/auth-context';
import usePageTitle from '../../hooks/usePageTitle';

import { changeEmailValidator } from '../../utils/validator';
import axios from '../../utils/axios';

const ChangeEmail = () => {
  usePageTitle('Change email / Kookoo');
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const { validateForm } = changeEmailValidator;

  const changeEmailMutation = useMutation(({ email }) => {
    return axios.patch('/api/users/my/email', {
      email,
    });
  });

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: validateForm,
    onSubmit: (values, { resetForm }) => {
      changeEmailMutation.mutate(
        {
          email: values.email,
        },
        {
          onSuccess: (response) => {
            updateUser(response.data.user);
            resetForm();
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-primary text-on-primary text-center py-2`}
              >
                <p>Email changed successfully</p>
              </div>
            ));
          },
          onError: (err) => {
            const error = err.response.data.errors || err.response.data.error;
            if (Array.isArray(error)) {
              const errors = error.reduce((acc, cur) => {
                acc[cur.param] = cur.msg;
                return acc;
              }, {});
              form.setMultipleFieldsError(errors);
            } else {
              form.setFieldError('email', 'Invalid email');
            }
          },
        }
      );
    },
  });
  return (
    <div>
      <div className="px-4 py-4 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-on-surface"
            title="back"
          >
            <IconContext.Provider
              value={{
                size: '18px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiArrowLeftLine />
            </IconContext.Provider>
          </button>
          <header>
            <h3 className="text-xl font-semibold">Change email</h3>
          </header>
        </div>
      </div>
      <div>
        <form className="px-4 py-4" onSubmit={form.handleSubmit}>
          <div className="mb-4">
            <TextInput
              id="email"
              name="email"
              label="Email"
              type="email"
              onFocus={form.handleFocus}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              value={form.values.email}
              error={form.touched.email ? form.errors.email : ''}
            />
          </div>
          <div>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmail;
