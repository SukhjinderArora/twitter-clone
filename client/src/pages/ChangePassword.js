/* eslint-disable react/jsx-no-constructed-context-values */
import { RiArrowLeftLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

import TextInput from '../components/TextInput';
import Button from '../components/Button';

import usePageTitle from '../hooks/usePageTitle';
import useForm from '../hooks/useForm';

import { changePasswordFormValidator } from '../utils/validator';
import axios from '../utils/axios';

const ChangePassword = () => {
  usePageTitle('Change your password / Kookoo');
  const navigate = useNavigate();

  const { validateForm } = changePasswordFormValidator;

  const changePasswordMutation = useMutation(
    ({ currentPassword, newPassword, confirmPassword }) => {
      return axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
    }
  );

  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: validateForm,
    onSubmit: (values, { resetForm }) => {
      changePasswordMutation.mutate(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          onSuccess: () => {
            resetForm();
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-primary text-on-primary text-center py-2`}
              >
                <p>Password changed successfully</p>
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
              form.setFieldError('currentPassword', 'Invalid password');
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
            <h3 className="text-xl font-semibold">Change your password</h3>
          </header>
        </div>
      </div>
      <div>
        <form className="px-4 py-4" onSubmit={form.handleSubmit}>
          <div className="mb-4">
            <TextInput
              id="currentPassword"
              name="currentPassword"
              label="Current password"
              onFocus={form.handleFocus}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              value={form.values.currentPassword}
              type="password"
              error={
                form.touched.currentPassword ? form.errors.currentPassword : ''
              }
            />
          </div>
          <div className="mb-4">
            <TextInput
              id="newPassword"
              name="newPassword"
              label="New password"
              onFocus={form.handleFocus}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              value={form.values.newPassword}
              type="password"
              error={form.touched.newPassword ? form.errors.newPassword : ''}
            />
          </div>
          <div className="mb-4">
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              onFocus={form.handleFocus}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              value={form.values.confirmPassword}
              type="password"
              error={
                form.touched.confirmPassword ? form.errors.confirmPassword : ''
              }
            />
          </div>
          <div>
            <Button type="submit" isLoading={changePasswordMutation.isLoading}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
