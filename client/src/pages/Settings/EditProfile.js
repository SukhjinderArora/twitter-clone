/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import { useNavigate, useLocation } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FiX } from 'react-icons/fi';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import TextInput from '../../components/TextInput';
import TextArea2 from '../../components/TextArea2';
import SelectInput from '../../components/SelectInput';
import Spinner from '../../components/Spinner';

import useForm from '../../hooks/useForm';
import { useAuth } from '../../contexts/auth-context';

import dayjs from '../../utils/day';
import { DateOptions } from '../../utils/utils';
import axios from '../../utils/axios';

import { editProfileValidator } from '../../utils/validator';

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const { name, bio, website, dob: dateOfBirth } = user.profile;
  const { state } = location;

  const { validateForm } = editProfileValidator;

  const editProfileMutation = useMutation(
    // eslint-disable-next-line no-shadow
    ({ name, bio, website, dateOfBirth }) => {
      return axios.put('/api/users/my/profile', {
        name,
        bio,
        website,
        dateOfBirth,
      });
    }
  );

  const form = useForm({
    initialValues: {
      name,
      bio: bio || '',
      website: website || '',
      month: `${dayjs(dateOfBirth).month() + 1}`,
      day: `${dayjs(dateOfBirth).date()}`,
      year: `${dayjs(dateOfBirth).year()}`,
    },
    validate: validateForm,
    onSubmit: (values) => {
      editProfileMutation.mutate(
        {
          name: values.name,
          bio: values.bio,
          website: values.website,
          dateOfBirth: new Date(
            `${values.year}/${values.month}/${values.day}`
          ).toISOString(),
        },
        {
          onSuccess: (response) => {
            queryClient.invalidateQueries(['user', user.username]);
            updateUser(response.data.user);
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-primary text-on-primary text-center py-2`}
              >
                <p>Profile updated successfully</p>
              </div>
            ));
            navigate(`/${user.username}`);
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
      <div className="px-4 py-2 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`${state.backgroundLocation.pathname}`, {
                replace: true,
              })
            }
            className="text-on-surface"
          >
            <IconContext.Provider
              // eslint-disable-next-line react/jsx-no-constructed-context-values
              value={{
                size: '22px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <FiX />
            </IconContext.Provider>
          </button>
          <div className="flex justify-between items-center flex-1">
            <h3 className="text-on-surface font-semibold text-xl">
              Edit profile
            </h3>
            <div>
              <label
                className="flex items-center justify-center bg-on-surface text-surface font-semibold rounded-2xl py-1 px-3 min-w-14 min-h-8"
                htmlFor="edit-profile-form-btn"
                role="button"
                tabIndex={0}
              >
                {editProfileMutation.isLoading ? (
                  <Spinner className="text-surface" />
                ) : (
                  'Save'
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <form className="px-4 py-4" onSubmit={form.handleSubmit}>
        <div className="mb-2">
          <TextInput
            id="name"
            name="name"
            label="Name"
            onFocus={form.handleFocus}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            value={form.values.name}
            type="text"
            error={form.touched.name ? form.errors.name : ''}
          />
        </div>
        <div className="mb-2">
          <TextArea2
            id="bio"
            name="bio"
            label="Bio"
            onFocus={form.handleFocus}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            value={form.values.bio}
            error={form.touched.bio ? form.errors.bio : ''}
          />
        </div>
        <div className="mb-2">
          <TextInput
            id="website"
            name="website"
            label="Website"
            onFocus={form.handleFocus}
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            value={form.values.website}
            type="text"
            error={form.touched.website ? form.errors.website : ''}
          />
        </div>
        <div className="mb-2">
          <div className="mb-2">
            <p className="text-on-surface">Date of Birth</p>
          </div>
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
        </div>
        <input type="submit" id="edit-profile-form-btn" className="hidden" />
      </form>
    </div>
  );
};

export default EditProfile;
