/* eslint-disable react/jsx-no-constructed-context-values */
import { IconContext } from 'react-icons';
import {
  RiChat1Line,
  RiRepeatLine,
  RiHeartLine,
  RiHeartFill,
  RiShareLine,
} from 'react-icons/ri';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';

import dayjs from '../../utils/day';
import axios from '../../utils/axios';

import { useAuth } from '../../contexts/auth-context';

const Post = ({ post }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const likePost = useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/like', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });

  const unLikePost = useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/unlike', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });

  const repost = useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/repost', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });

  const removeRepost = useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/repost/remove', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });

  const likePostHandler = () => {
    likePost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      }
    );
  };

  const postUnLikeHandler = () => {
    unLikePost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      }
    );
  };

  const repostHandler = () => {
    repost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      }
    );
  };

  const removeRepostHandler = () => {
    removeRepost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      }
    );
  };

  return (
    <article className="flex justify-between gap-3 bg-surface text-on-surface px-3 py-2 mb-4 border-b border-on-surface/30">
      <div className="h-10 w-10 overflow-hidden">
        <img
          className="h-full w-full rounded-full object-cover"
          src="https://i.pravatar.cc/300"
          alt="avatar"
        />
      </div>
      <div className="flex-1">
        <div className="flex">
          <h3 className="font-semibold text-sm mr-2">
            {post.user.profile.name}
          </h3>
          <span className="font-light text-sm text-on-surface/90 font-source-sans-pro to mr-2">
            @{post.user.username}
          </span>
          <span className="font-light text-sm text-on-surface/90 font-lato">
            {dayjs(post.createdAt).fromNow(true)}
          </span>
        </div>
        <div className="my-2">
          <p className="text-sm text-semibold font-source-sans-pro break-all">
            {post.content}
          </p>
        </div>
        <div className="flex justify-between text-on-surface/50">
          <div className="flex items-center gap-2">
            <span>
              <IconContext.Provider
                value={{
                  size: '14px',
                  style: {
                    color: 'inherit',
                  },
                }}
              >
                <RiChat1Line />
              </IconContext.Provider>
            </span>
            <span className="text-on-surface/70 text-xs">
              {post.replies.length > 0 && post.replies.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {post.reposts.some((re) => re.userId === user.id) ? (
              <button type="button" onClick={removeRepostHandler}>
                <IconContext.Provider
                  value={{
                    size: '14px',
                    style: {
                      color: 'green',
                    },
                  }}
                >
                  <RiRepeatLine />
                </IconContext.Provider>
              </button>
            ) : (
              <button type="button" onClick={repostHandler}>
                <IconContext.Provider
                  value={{
                    size: '14px',
                    style: {
                      color: 'inherit',
                    },
                  }}
                >
                  <RiRepeatLine />
                </IconContext.Provider>
              </button>
            )}
            <span className="text-on-surface/70 text-xs">
              {post.reposts.length > 0 && post.reposts.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {post.likes.some((like) => like.userId === user.id) ? (
              <button type="button" onClick={postUnLikeHandler}>
                <IconContext.Provider
                  value={{
                    size: '14px',
                    style: {
                      fill: '#b91c1c',
                    },
                  }}
                >
                  <RiHeartFill />
                </IconContext.Provider>
              </button>
            ) : (
              <button type="button" onClick={likePostHandler}>
                <IconContext.Provider
                  value={{
                    size: '14px',
                    style: {
                      color: 'inherit',
                    },
                  }}
                >
                  <RiHeartLine />
                </IconContext.Provider>
              </button>
            )}
            <span className="text-on-surface/70 text-xs">
              {post.likes.length > 0 && post.likes.length}
            </span>
          </div>
          <div>
            <IconContext.Provider
              value={{
                size: '14px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiShareLine />
            </IconContext.Provider>
          </div>
        </div>
      </div>
    </article>
  );
};

Post.propTypes = {
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
  }).isRequired,
};

export default Post;
