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
import { useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import dayjs from '../../utils/day';

import { useAuth } from '../../contexts/auth-context';
import useLikePost from '../../hooks/useLikePost';
import useUnLikePost from '../../hooks/useUnLikePost';
import useRepost from '../../hooks/useRepost';
import useRemoveRepost from '../../hooks/useRemoveRepost';

const Post = ({ post }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const likePost = useLikePost();
  const unLikePost = useUnLikePost();
  const repost = useRepost();
  const removeRepost = useRemoveRepost();

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

  const navigateToPostDetails = () => {
    navigate(`/${post.user.username}/post/${post.id}`);
  };

  return (
    <article className="flex justify-between gap-3 bg-surface text-on-surface px-3 py-2 mb-4 border-b border-on-surface/30">
      <Link to={`/${post.user.username}`}>
        <div className="h-10 w-10 overflow-hidden">
          <img
            className="h-full w-full rounded-full object-cover"
            src="https://i.pravatar.cc/300"
            alt="avatar"
          />
        </div>
      </Link>
      <div className="flex-1">
        <div className="flex">
          <Link
            to={`/${post.user.username}`}
            className="font-semibold text-sm mr-2"
          >
            {post.user.profile.name}
          </Link>
          <Link
            to={`/${post.user.username}`}
            className="font-light text-sm text-on-surface/90 font-source-sans-pro to mr-2"
          >
            @{post.user.username}
          </Link>
          <span className="font-light text-sm text-on-surface/90 font-lato">
            {dayjs(post.createdAt).fromNow(true)}
          </span>
        </div>
        {post.parentPost && (
          <div className="text-sm text-on-surface/75 my-1">
            Replying to{' '}
            <Link
              to={`/${post.parentPost.user.username}`}
              className="text-primary text-base"
            >
              @{post.parentPost.user.username}
            </Link>
          </div>
        )}
        <div className="my-2">
          <Link to={`/${post.user.username}/post/${post.id}`}>
            <p className="text-sm text-semibold font-source-sans-pro break-all">
              {post.content}
            </p>
          </Link>
        </div>
        <div className="flex justify-between text-on-surface/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={navigateToPostDetails}
              className="cursor-pointer"
            >
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
            {isAuthenticated &&
            post.likes.some((like) => like.userId === user.id) ? (
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

export default Post;
