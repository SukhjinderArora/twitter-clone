/* eslint-disable react/jsx-no-constructed-context-values */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import {
  RiChat1Line,
  RiRepeatLine,
  RiHeartLine,
  RiHeartFill,
  RiShareLine,
} from 'react-icons/ri';
import { useMutation, useQueryClient } from 'react-query';

import dayjs from '../../utils/day';
import axios from '../../utils/axios';
import { useAuth } from '../../contexts/auth-context';

const SelectedPost = ({ post }) => {
  const { isAuthenticated, user } = useAuth();
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
          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0].includes('post');
            },
          });
        },
      }
    );
  };

  const postUnLikeHandler = () => {
    unLikePost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0].includes('post');
            },
          });
        },
      }
    );
  };

  const repostHandler = () => {
    repost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0].includes('post');
            },
          });
        },
      }
    );
  };

  const removeRepostHandler = () => {
    removeRepost.mutate(
      { postId: post.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0].includes('post');
            },
          });
        },
      }
    );
  };

  return (
    <article className="bg-surface text-on-surface py-3 px-2">
      <div className="flex gap-3">
        <Link to={`/${post.user.username}`}>
          <div className="h-14 w-14 overflow-hidden">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://i.pravatar.cc/300"
              alt="avatar"
            />
          </div>
        </Link>
        <div>
          <div>
            <Link
              to={`/${post.user.username}`}
              className="font-semibold text-base mr-2"
            >
              {post.user.profile.name}
            </Link>
          </div>
          <div className=" -mt-2">
            <Link
              to={`/${post.user.username}`}
              className="text-sm text-on-surface/75 font-source-sans-pro"
            >
              @{post.user.username}
            </Link>
          </div>
        </div>
      </div>
      {post.parentPost && (
        <div className="text-sm text-on-surface/75 my-3">
          Replying to{' '}
          <Link
            to={`/${post.parentPost.user.username}`}
            className="text-primary text-base"
          >
            @{post.parentPost.user.username}
          </Link>
        </div>
      )}
      <div className="my-3">
        <p className="text-lg">{post.content}</p>
      </div>
      <div className="text-sm text-on-surface/75 flex gap-2">
        <span>{dayjs(post.createdAt).format('h:mm A')}</span>
        <div className="font-lg font-bold">
          <span>-</span>
        </div>
        <span>{dayjs(post.createdAt).format('MMM D, YYYY')}</span>
      </div>
      <div className="h-[1px] bg-on-surface/30 mt-3" />
      <div className="my-3 flex gap-3">
        <div>
          <span className="font-bold">{post.reposts.length}</span>{' '}
          <span className="text-on-surface/75">Repost</span>
        </div>
        <div>
          <span className="font-bold">{post.likes.length}</span>{' '}
          <span className="text-on-surface/75">Like</span>
        </div>
      </div>
      <div className="h-[1px] bg-on-surface/30 mb-3" />
      <div className="my-3">
        <div className="flex justify-between text-on-surface/50">
          <div className="flex items-center gap-2">
            <button type="button" className="cursor-pointer">
              <IconContext.Provider
                value={{
                  size: '18px',
                  style: {
                    color: 'inherit',
                  },
                }}
              >
                <RiChat1Line />
              </IconContext.Provider>
            </button>
            <span className="text-on-surface/70 text-xs">
              {post.replies.length > 0 && post.replies.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated &&
            post.reposts.some((re) => re.userId === user.id) ? (
              <button type="button" onClick={removeRepostHandler}>
                <IconContext.Provider
                  value={{
                    size: '18px',
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
                    size: '18px',
                    style: {
                      color: 'inherit',
                    },
                  }}
                >
                  <RiRepeatLine />
                </IconContext.Provider>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated &&
            post.likes.some((like) => like.userId === user.id) ? (
              <button type="button" onClick={postUnLikeHandler}>
                <IconContext.Provider
                  value={{
                    size: '18px',
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
                    size: '18px',
                    style: {
                      color: 'inherit',
                    },
                  }}
                >
                  <RiHeartLine />
                </IconContext.Provider>
              </button>
            )}
          </div>
          <div>
            <IconContext.Provider
              value={{
                size: '18px',
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
      <div className="h-[1px] bg-on-surface/30 mb-3" />
    </article>
  );
};

SelectedPost.propTypes = {
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

export default SelectedPost;
