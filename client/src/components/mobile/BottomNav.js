/* eslint-disable react/jsx-no-constructed-context-values */
import { Link } from 'react-router-dom';
import {
  RiHome7Fill,
  RiSearchLine,
  RiNotificationLine,
  RiMailLine,
} from 'react-icons/ri';

import { IconContext } from 'react-icons';

const BottomNav = () => {
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
