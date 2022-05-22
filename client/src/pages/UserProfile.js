import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { RiCalendar2Line } from 'react-icons/ri';
import { IconContext } from 'react-icons';

import axios from '../utils/axios';

import Spinner from '../components/Spinner';
import NoMatch from './NoMatch';

import { useAuth } from '../contexts/auth-context';

const UserProfile = () => {
  const { username } = useParams();
  const { isAuthenticated, user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const userData = useQuery(
    ['user', username],
    () => {
      return axios.get(`/api/users/${username}`);
    },
    {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.response?.data?.error?.status === 404) return false;
        return 3;
      },
    }
  );

  const user = userData.data?.data?.user;

  const followUser = useMutation(
    ({ followeeId }) => {
      return axios.patch('/api/users/follow', {
        followeeId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
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
          {isAuthenticated &&
            user.id !== authUser.id &&
            user.followedBy.every(
              (follower) => follower.id !== authUser.id
            ) && (
              <button
                type="button"
                className="bg-on-surface text-surface font-source-sans-pro text-sm font-bold px-4 rounded-full w-24"
                onClick={onFollowUser}
              >
                Follow
              </button>
            )}
          {isAuthenticated &&
            user.id !== authUser.id &&
            user.followedBy.some((follower) => follower.id === authUser.id) && (
              <button
                type="button"
                className="bg-on-surface text-surface font-source-sans-pro text-sm font-bold px-4 rounded-full w-24"
                onClick={onUnFollowUser}
              >
                Unfollow
              </button>
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
            <span className="text-on-surface/75">Following</span>
          </div>
          <div>
            {user.followedBy.length}{' '}
            <span className="text-on-surface/75">Followers</span>
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
