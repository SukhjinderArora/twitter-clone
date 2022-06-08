import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import TextArea from '../TextArea';
import Button from '../Button';

import { newPostValidator } from '../../utils/validator';
import axios from '../../utils/axios';

import useForm from '../../hooks/useForm';

const ReplyToPost = ({ post }) => {
  const { validateForm } = newPostValidator;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  return (
    <div className="px-2 pb-2">
      <div className="flex gap-3">
        <div className="h-10 w-10 overflow-hidden">
          <img
            className="h-full w-full rounded-full object-cover"
            src="https://i.pravatar.cc/300"
            alt="avatar"
          />
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-on-surface/75">Replying to </span>
            <span className="text-primary">@{post.user.username}</span>
          </div>
          <form onSubmit={replyForm.handleSubmit}>
            <div>
              <TextArea
                name="content"
                id="content"
                label="Post your reply"
                onFocus={replyForm.handleFocus}
                onBlur={replyForm.handleBlur}
                onChange={replyForm.handleChange}
                value={replyForm.values.content}
                error={
                  replyForm.touched.content ? replyForm.errors.content : ''
                }
              />
            </div>
            <div>
              <Button type="submit" isLoading={postReply.isLoading}>
                Post
              </Button>
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
