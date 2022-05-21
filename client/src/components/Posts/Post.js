/* eslint-disable react/jsx-no-constructed-context-values */
import { IconContext } from 'react-icons';
import {
  RiChat1Line,
  RiRepeatLine,
  RiHeartLine,
  RiShareLine,
} from 'react-icons/ri';
import PropTypes from 'prop-types';
import dayjs from '../../utils/day';

const Post = ({ post }) => {
  return (
    <article className="flex justify-between gap-3 bg-surface text-on-surface px-3 py-2 mb-4 border-b border-on-surface/30 last:border-0">
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
          <div>
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
          </div>
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
                <RiHeartLine />
              </IconContext.Provider>
            </span>
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
  }).isRequired,
};

export default Post;
