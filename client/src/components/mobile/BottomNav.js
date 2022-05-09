/* eslint-disable react/jsx-no-constructed-context-values */
import {
  RiHome7Fill,
  RiSearchLine,
  RiNotificationLine,
  RiMailLine,
} from 'react-icons/ri';

import { IconContext } from 'react-icons';

const BottomNav = () => {
  return (
    <div className="flex bg-surface justify-between items-center px-3 h-14">
      <div className="text-on-surface">
        <IconContext.Provider
          value={{
            size: '32px',
            style: {
              color: 'inherit',
            },
          }}
        >
          <RiHome7Fill />
        </IconContext.Provider>
      </div>
      <div className="text-on-surface">
        <IconContext.Provider
          value={{
            size: '32px',
            style: {
              color: 'inherit',
            },
          }}
        >
          <RiSearchLine />
        </IconContext.Provider>
      </div>
      <div className="text-on-surface">
        <IconContext.Provider
          value={{
            size: '32px',
            style: {
              color: 'inherit',
            },
          }}
        >
          <RiNotificationLine />
        </IconContext.Provider>
      </div>
      <div className="text-on-surface">
        <IconContext.Provider
          value={{
            size: '32px',
            style: {
              color: 'inherit',
            },
          }}
        >
          <RiMailLine />
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default BottomNav;
