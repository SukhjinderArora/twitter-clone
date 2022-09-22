import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import TextArea from '../TextArea';
import CircularProgressBar from '../CircularProgressBar';

import useForm from '../../hooks/useForm';

import axios from '../../utils/axios';
import { newPostValidator } from '../../utils/validator';
import { useAuth } from '../../contexts/auth-context';

const ComposePost = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { state } = useLocation();
  const createNewPost = useMutation(({ content }) => {
    return axios.post('/api/post/create-post', {
      content,
    });
  });
  const { user } = useAuth();
  const { validateForm } = newPostValidator;
  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: validateForm,
    onSubmit: (values, { resetForm }) => {
      createNewPost.mutate(
        {
          content: values.content,
        },
        {
          onSuccess: ({ data }) => {
            resetForm();
            navigate(state?.backgroundLocation?.pathname || '/home');
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-primary text-on-primary flex justify-between px-2 py-2`}
              >
                <p>Your post was sent.</p>
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate(
                      `/${data.post.user.username}/post/${data.post.id}`
                    );
                  }}
                >
                  View
                </button>
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
              form.setFieldError('password', error.message);
            }
          },
        }
      );
    },
  });
  const onTextChange = (e) => {
    form.handleChange(e);
    const progressPercentage = (e.target.value.length / 255) * 100;
    setProgress(progressPercentage > 100 ? 100 : progressPercentage);
  };
  return (
    <div className="px-4 py-3">
      <div className="flex">
        <div className="h-10 w-10 overflow-hidden">
          <img
            className="h-full w-full rounded-full object-cover"
            src={user.profile.img}
            alt="user avatar"
          />
        </div>
        <form onSubmit={form.handleSubmit} className="flex flex-col flex-1">
          <div className="border-b-2 border-on-surface/10 mb-2">
            <TextArea
              id="content"
              name="content"
              label="What's happening?"
              value={form.values.content}
              error={form.touched.content ? form.errors.content : ''}
              autoExpand
              onBlur={form.handleBlur}
              onChange={onTextChange}
              onFocus={form.handleFocus}
            />
          </div>
          <div className="self-end flex gap-2">
            <div
              className={`relative ${
                form.values.content.length === 0 && 'hidden'
              }`}
            >
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs ${
                  form.values.content.length > 255
                    ? 'text-on-error'
                    : 'text-on-surface'
                }`}
              >
                {form.values.content.length}
              </div>
              <CircularProgressBar
                progress={progress}
                indicatorWidth={4}
                trackWidth={4}
                size={40}
              />
            </div>
            <button
              type="submit"
              className={`font-source-sans-pro bg-primary text-on-primary font-semibold px-4 py-2 rounded-3xl transition-colors hover:bg-primary-dark ${
                (!form.values.content.trim() || form.errors.content) &&
                'bg-primary/50 text-on-primary/50 hover:bg-primary/50 cursor-not-allowed'
              }`}
              disabled={!form.values.content.trim() || form.errors.content}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposePost;
