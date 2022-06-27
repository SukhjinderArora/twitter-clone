/* eslint-disable react/jsx-no-constructed-context-values */
import { Link } from 'react-router-dom';
import {
  RiHome7Fill,
  RiSearchLine,
  RiNotificationLine,
  RiMailLine,
} from 'react-icons/ri';

import { IconContext } from 'react-icons';

import useNotifications from '../../hooks/useNotifications';

const BottomNav = () => {
  const notificationData = useNotifications();
  return (
    <div className="flex bg-surface justify-between items-center px-8 h-14">
      <div className="text-on-surface">
        <Link to="/home">
          <IconContext.Provider
            value={{
              size: '24px',
              style: {
                color: 'inherit',
              },
            }}
          >
            <RiHome7Fill />
          </IconContext.Provider>
        </Link>
      </div>
      <div className="text-on-surface">
        <Link to="/explore">
          <IconContext.Provider
            value={{
              size: '24px',
              style: {
                color: 'inherit',
              },
            }}
          >
            <RiSearchLine />
          </IconContext.Provider>
        </Link>
      </div>
      <div className="text-on-surface">
        <Link to="/notifications">
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
                <RiNotificationLine />
              </IconContext.Provider>
            </span>
            {notificationData.isSuccess &&
              notificationData.data.pages[0].info.total > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs">
                  <span>{notificationData.data.pages[0].info.total}</span>
                </span>
              )}
          </div>
        </Link>
      </div>
      <div className="text-on-surface">
        <Link to="/messages">
          <IconContext.Provider
            value={{
              size: '24px',
              style: {
                color: 'inherit',
              },
            }}
          >
            <RiMailLine />
          </IconContext.Provider>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
