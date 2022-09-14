import { useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Outlet,
  NavLink,
  useParams,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { RiCalendar2Line, RiMailLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';

import axios from '../utils/axios';

import Spinner from '../components/Spinner';
import NoMatch from './NoMatch';

import useUser from '../hooks/useUser';
import useScrollToTop from '../hooks/useScrollToTop';
import usePageTitle from '../hooks/usePageTitle';

import { useAuth } from '../contexts/auth-context';
import { useSocket } from '../contexts/socket-context';

const UserProfile = () => {
  useScrollToTop();
  const { username } = useParams();
  const { isAuthenticated, user: authUser } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { setPageTitle } = usePageTitle();

  const userData = useUser(username);

  const { user } = userData.data || {};

  useEffect(() => {
    if (user?.username) {
      setPageTitle(`${user.profile.name} (@${user.username})`);
    }
  }, [user, setPageTitle]);

  const followUser = useMutation(
    ({ followeeId }) => {
      return axios.patch('/api/users/follow', {
        followeeId,
      });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('user');
        socket.emit('new notification', {
          to: data.data.followeeId,
        });
      },
    }
  );

  const unFollowUser = useMutation(
    ({ followeeId }) => {
      return axios.patch('/api/users/unfollow', {
        followeeId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
    }
  );

  const getChat = useMutation(
    ({ participantId }) => {
      return axios.post('/api/chat/new', {
        participantId,
      });
    },
    {
      onSuccess: (data) => {
        navigate(`/messages/${data.data.id}`);
      },
    }
  );

  const onFollowUser = () => {
    followUser.mutate({
      followeeId: user?.id,
    });
  };

  const onUnFollowUser = () => {
    unFollowUser.mutate({
      followeeId: user?.id,
    });
  };

  const openModal = useCallback(() => {
    navigate('/settings/profile', {
      state: {
        backgroundLocation: location,
      },
      replace: true,
    });
  }, [location, navigate]);

  useEffect(() => {
    if (location.state?.from?.pathname === '/settings/profile') {
      openModal();
    }
  }, [openModal, location.state?.from?.pathname]);

  if (userData.isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (userData.isError) return <NoMatch />;

  return (
    <div>
      <div className="bg-gray-500 h-24" />
      <div className="px-3">
        <div className="flex justify-between mt-2">
          <div className="w-24 h-24 rounded-full overflow-hidden -mt-14">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {isAuthenticated && user.id === authUser.id && (
            <div>
              <button
                type="button"
                className="text-on-surface font-semibold border-2 border-on-surface/40 rounded-full py-1 px-3"
                onClick={openModal}
              >
                Edit profile
              </button>
            </div>
          )}
          {isAuthenticated && user.id !== authUser.id && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-on-surface border border-on-surface/30 p-1 rounded-full"
                onClick={() => {
                  getChat.mutate({
                    participantId: user.id,
                  });
                }}
              >
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{
                    size: '18px',
                    style: {
                      color: 'inherit',
                    },
                  }}
                >
                  <RiMailLine />
                </IconContext.Provider>
              </button>
              {user.followedBy.every(
                (follower) => follower.id !== authUser.id
              ) && (
                <button
                  type="button"
                  className="bg-on-surface text-surface font-source-sans-pro text-sm font-bold px-4 py-2 rounded-full w-24"
                  onClick={onFollowUser}
                >
                  Follow
                </button>
              )}
              {user.followedBy.some(
                (follower) => follower.id === authUser.id
              ) && (
                <button
                  type="button"
                  className="bg-on-surface text-surface font-source-sans-pro text-sm font-bold px-4 py-2 rounded-full w-24"
                  onClick={onUnFollowUser}
                >
                  Unfollow
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mt-5">
          <h2 className="text-on-surface text-lg font-bold">
            {user.profile.name}
          </h2>
          <h5 className="text-on-surface/75 text-sm -mt-1">@{user.username}</h5>
        </div>
        <div className="text-on-surface/75 flex gap-1 my-4">
          <span>
            <IconContext.Provider
              // eslint-disable-next-line react/jsx-no-constructed-context-values
              value={{
                size: '24px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiCalendar2Line />
            </IconContext.Provider>
          </span>
          <span>
            Joined{' '}
            {new Date(user.createdAt).toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex text-on-surface gap-4">
          <div>
            {user.following.length}{' '}
            <Link to="list/following" className="text-on-surface/75">
              Following
            </Link>
          </div>
          <div>
            {user.followedBy.length}{' '}
            <Link to="list/followers" className="text-on-surface/75">
              Followers
            </Link>
          </div>
        </div>
      </div>
      <div className="px-3 flex justify-between text-on-surface/75 mt-6">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `pb-1 ${
              isActive ? 'text-on-surface border-b-2 border-primary' : ''
            }`
          }
        >
          Posts
        </NavLink>
        <NavLink
          to="with_replies"
          className={({ isActive }) =>
            `pb-1 ${
              isActive ? 'text-on-surface border-b-2 border-primary' : ''
            }`
          }
        >
          Posts & Replies
        </NavLink>
        <NavLink
          to="likes"
          className={({ isActive }) =>
            `pb-1 ${
              isActive ? 'text-on-surface border-b-2 border-primary' : ''
            }`
          }
        >
          Likes
        </NavLink>
      </div>
      <div className="h-[1px] bg-on-surface/30 my-3" />
      <div className="px-3 pb-14">
        <Outlet context={{ userId: user.id }} />
      </div>
    </div>
  );
};

export default UserProfile;
