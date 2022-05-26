import { NavLink, Outlet, useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';
import NoMatch from './NoMatch';

import useUser from '../hooks/useUser';

const Follow = () => {
  const { username } = useParams();
  const userData = useUser(username);

  const user = userData.data?.user || {};

  if (userData.isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (userData.isError && userData.error.response?.status === 404)
    return <NoMatch />;

  return (
    <div>
      <div className="px-3 flex justify-around text-on-surface/75 mt-6">
        <NavLink
          to="following"
          end
          className={({ isActive }) =>
            `pb-1 ${
              isActive ? 'text-on-surface border-b-2 border-primary' : ''
            }`
          }
        >
          Following
        </NavLink>
        <NavLink
          to="followers"
          className={({ isActive }) =>
            `pb-1 ${
              isActive ? 'text-on-surface border-b-2 border-primary' : ''
            }`
          }
        >
          Followers
        </NavLink>
      </div>
      <div className="h-[1px] bg-on-surface/30 my-3" />
      <div className="px-3 pb-14">
        <Outlet context={{ userId: user.id }} />
      </div>
    </div>
  );
};

export default Follow;
