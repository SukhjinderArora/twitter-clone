/* eslint-disable react/jsx-no-constructed-context-values */
import { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import {
  RiShareLine,
  RiHome7Line,
  RiHome7Fill,
  RiSearchLine,
  RiSearchFill,
  RiMailLine,
  RiMailFill,
  RiNotificationLine,
  RiNotificationFill,
  RiUserLine,
  RiUserFill,
  RiMoreLine,
  RiMoreFill,
} from 'react-icons/ri';

import { useAuth } from '../../contexts/auth-context';

const SideNav = () => {
  const [, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const openModal = () => {
    setModalOpen(true);
    navigate('/compose/post', {
      state: {
        backgroundLocation: location,
      },
      replace: true,
    });
  };

  return (
    <div className="px-4 py-6 border-r border-on-surface/20 min-h-full flex flex-col justify-between">
      <div>
        <div className="text-primary px-4 mb-3">
          <IconContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
              size: '36px',
              color: 'inherit',
            }}
          >
            <RiShareLine />
          </IconContext.Provider>
        </div>
        <nav className="navigation">
          <ul>
            <li className="text-on-surface mb-3">
              <NavLink to="/home">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-3xl px-4 py-2 w-fit ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <span>
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        {isActive ? <RiHome7Fill /> : <RiHome7Line />}
                      </IconContext.Provider>
                    </span>
                    <span className={`text-xl ${isActive && 'font-semibold'}`}>
                      Home
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
            <li className="text-on-surface mb-3">
              <NavLink to="/search">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-3xl px-4 py-2 w-fit ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <span>
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        {isActive ? <RiSearchFill /> : <RiSearchLine />}
                      </IconContext.Provider>
                    </span>
                    <span className={`text-xl ${isActive && 'font-semibold'}`}>
                      Search
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
            <li className="text-on-surface mb-3">
              <NavLink to="/messages">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-3xl px-4 py-2 w-fit ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <span>
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        {isActive ? <RiMailFill /> : <RiMailLine />}
                      </IconContext.Provider>
                    </span>
                    <span className={`text-xl ${isActive && 'font-semibold'}`}>
                      Messages
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
            <li className="text-on-surface mb-3">
              <NavLink to="/notifications">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-3xl px-4 py-2 w-fit ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <span>
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        {isActive ? (
                          <RiNotificationFill />
                        ) : (
                          <RiNotificationLine />
                        )}
                      </IconContext.Provider>
                    </span>
                    <span className={`text-xl ${isActive && 'font-semibold'}`}>
                      Notifications
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
            <li className="text-on-surface mb-3">
              <NavLink to={`/${user.username}`}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-3xl px-4 py-2 w-fit ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <span>
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        {isActive ? <RiUserFill /> : <RiUserLine />}
                      </IconContext.Provider>
                    </span>
                    <span className={`text-xl ${isActive && 'font-semibold'}`}>
                      Profile
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
            <li className="text-on-surface mb-3">
              <NavLink to="/ccc">
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-3xl px-4 py-2 w-fit ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <span>
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        {isActive ? <RiMoreFill /> : <RiMoreLine />}
                      </IconContext.Provider>
                    </span>
                    <span className={`text-xl ${isActive && 'font-semibold'}`}>
                      More
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
          <div className="mt-4">
            <button
              type="button"
              onClick={openModal}
              className="bg-primary text-on-primary text-base w-full py-3 rounded-3xl"
            >
              Add Post
            </button>
          </div>
        </nav>
      </div>
      <Link to={`/${user.username}`} className="flex gap-2">
        <div className="h-10 w-10 overflow-hidden">
          <img
            className="h-full w-full rounded-full object-cover"
            src="https://i.pravatar.cc/300"
            alt="avatar"
          />
        </div>
        <div className="flex justify-between flex-1 items-center">
          <div>
            <p className="font-semibold">{user.profile.name}</p>
            <p className="text-sm text-on-surface/70 -mt-1">@{user.username}</p>
          </div>
          <div className="font-bold">...</div>
        </div>
      </Link>
    </div>
  );
};

export default SideNav;
