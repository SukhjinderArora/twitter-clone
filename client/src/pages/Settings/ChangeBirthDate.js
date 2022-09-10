/* eslint-disable react/jsx-no-constructed-context-values */
import { RiArrowLeftLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import SelectInput from '../../components/SelectInput';
import Button from '../../components/Button';

import useForm from '../../hooks/useForm';
import { useAuth } from '../../contexts/auth-context';

import { DateOptions } from '../../utils/utils';
import { ChangeBirthDateValidator } from '../../utils/validator';
import axios from '../../utils/axios';

const ChangeBirthDate = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { validateForm } = ChangeBirthDateValidator;

  const updateDOB = useMutation(({ dateOfBirth }) => {
    return axios.patch('/api/users/my/dob', {
      dateOfBirth,
    });
  });

  const form = useForm({
    initialValues: {
      month: '',
      day: '',
      year: '',
    },
    validate: validateForm,
    onSubmit: (values, { resetForm }) => {
      updateDOB.mutate(
        {
          dateOfBirth: new Date(
            `${values.year}/${values.month}/${values.day}`
          ).toISOString(),
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
                <p>Date of birth changed successfully</p>
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
            <h3 className="text-xl font-semibold">Change date of birth</h3>
          </header>
        </div>
      </div>
      <div>
        <form
          // className="h-full relative"
          className="px-4 py-4"
          onSubmit={form.handleSubmit}
        >
          <div className="flex justify-between gap-3 mb-4">
            <div className="w-1/2">
              <SelectInput
                id="month"
                name="month"
                value={form.values.month}
                label="Month"
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                error={form.touched.month ? form.errors.month : ''}
                options={DateOptions.months}
              />
            </div>
            <div className="w-1/4">
              <SelectInput
                id="year"
                name="year"
                value={form.values.year}
                label="Year"
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                error={form.touched.year ? form.errors.year : ''}
                options={DateOptions.getYearsInRange(DateOptions.year_range)}
              />
            </div>
            <div className="w-1/4">
              <SelectInput
                id="day"
                name="day"
                value={form.values.day}
                label="Day"
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
                error={form.touched.day ? form.errors.day : ''}
                options={DateOptions.daysInMonth(
                  form.values.month,
                  form.values.year
                )}
              />
            </div>
          </div>
          <div>
            <Button type="submit" isLoading={updateDOB.isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeBirthDate;
