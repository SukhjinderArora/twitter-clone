import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import TextArea from '../TextArea';
import CircularProgressBar from '../CircularProgressBar';

import { newPostValidator } from '../../utils/validator';
import axios from '../../utils/axios';

import useForm from '../../hooks/useForm';
import { useSocket } from '../../contexts/socket-context';
import { useAuth } from '../../contexts/auth-context';

const ReplyToPost = ({ post }) => {
  const [progress, setProgress] = useState(0);
  const { validateForm } = newPostValidator;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const socket = useSocket();

  const postReply = useMutation(({ postId, content }) => {
    return axios.post('/api/post/reply', {
      content,
      postId,
    });
  });

  const replyForm = useForm({
    initialValues: {
      content: '',
    },
    validate: validateForm,
    onSubmit: async (values, { resetForm }) => {
      postReply.mutate(
        {
          content: values.content,
          postId: post.id,
        },
        {
          onSuccess: ({ data }) => {
            socket.emit('new notification', {
              to: data.post.parentPost.user.id,
            });
            queryClient.invalidateQueries(['post', 'children', `${post.id}`]);
            resetForm();
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
              replyForm.setMultipleFieldsError(errors);
            } else {
              replyForm.setFieldError('password', error.message);
            }
          },
        }
      );
    },
  });

  const onTextChange = (e) => {
    replyForm.handleChange(e);
    const progressPercentage = (e.target.value.length / 255) * 100;
    setProgress(progressPercentage > 100 ? 100 : progressPercentage);
  };

  return (
    <div className="px-2 pb-2">
      <div className="flex gap-3">
        <div className="h-10 w-10 overflow-hidden">
          <img
            className="h-full w-full rounded-full object-cover"
            src={user.profile.img}
            alt="avatar"
          />
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-on-surface/75">Replying to </span>
            <span className="text-primary">@{post.user.username}</span>
          </div>
          <form onSubmit={replyForm.handleSubmit} className="flex flex-col">
            <div>
              <TextArea
                name="content"
                id="content"
                label="Post your reply"
                onFocus={replyForm.handleFocus}
                onBlur={replyForm.handleBlur}
                onChange={onTextChange}
                value={replyForm.values.content}
                error={
                  replyForm.touched.content ? replyForm.errors.content : ''
                }
              />
            </div>
            <div className="self-end flex gap-2">
              <div
                className={`relative ${
                  replyForm.values.content.length === 0 && 'hidden'
                }`}
              >
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs ${
                    replyForm.values.content.length > 255
                      ? 'text-on-error'
                      : 'text-on-surface'
                  }`}
                >
                  {replyForm.values.content.length}
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
                  (!replyForm.values.content.trim() ||
                    replyForm.errors.content) &&
                  'bg-primary/50 text-on-primary/50 hover:bg-primary/50 cursor-not-allowed'
                }`}
                disabled={
                  !replyForm.values.content.trim() || replyForm.errors.content
                }
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="h-[1px] bg-on-surface/30 mt-3" />
    </div>
  );
};

ReplyToPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string,
      profile: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    createdAt: PropTypes.string,
    replies: PropTypes.arrayOf(PropTypes.shape({})),
    likes: PropTypes.arrayOf(PropTypes.shape({})),
    reposts: PropTypes.arrayOf(PropTypes.shape({})),
    parentPost: PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string,
        profile: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
};

export default ReplyToPost;
