/* eslint-disable react/jsx-no-constructed-context-values */
import { NavLink } from 'react-router-dom';
import {
  RiHome7Line,
  RiHome7Fill,
  RiSearchLine,
  RiSearchFill,
  RiNotificationLine,
  RiNotificationFill,
  RiMailLine,
  RiMailFill,
} from 'react-icons/ri';

import { IconContext } from 'react-icons';

import useNotifications from '../../hooks/useNotifications';

const BottomNav = () => {
  const notificationData = useNotifications();
  return (
    <div className="flex bg-surface justify-between items-center px-8 h-14 border-t border-on-surface/20">
      <div className="text-on-surface">
        <NavLink to="/home">
          {({ isActive }) => (
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
          )}
        </NavLink>
      </div>
      <div className="text-on-surface">
        <NavLink to="/search">
          {({ isActive }) => (
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
          )}
        </NavLink>
      </div>
      <div className="text-on-surface">
        <NavLink to="/notifications">
          {({ isActive }) => (
            <div className="relative">
              <span>
                <IconContext.Provider
                  value={{
                    size: '24px',
                    style: {
                      color: 'inherit',
                    },
                  }}
                >
                  {isActive ? <RiNotificationFill /> : <RiNotificationLine />}
                </IconContext.Provider>
              </span>
              {notificationData.isSuccess &&
                notificationData.data.pages[0].info.unReadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs">
                    <span>
                      {notificationData.data.pages[0].info.unReadNotifications}
                    </span>
                  </span>
                )}
            </div>
          )}
        </NavLink>
      </div>
      <div className="text-on-surface">
        <NavLink to="/messages">
          {({ isActive }) => (
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
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
