/* eslint-disable react/jsx-no-constructed-context-values */
import { Outlet, NavLink } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';

import usePageTitle from '../hooks/usePageTitle';

const Settings = () => {
  usePageTitle('Settings / Kookoo');
  return (
    <div className="flex min-h-full">
      <div className="flex-1 border-r border-on-surface/20 min-h-full py-4">
        <header>
          <h1 className="text-xl font-semibold px-4">Settings</h1>
        </header>
        <nav className="mt-4">
          <ul>
            <li>
              <NavLink to="account">
                {({ isActive }) => (
                  <div
                    className={`flex justify-between py-3 px-4 ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <p className="text-on-surface">Account information</p>
                    <div className="text-on-surface/80">
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        <RiArrowRightSLine />
                      </IconContext.Provider>
                    </div>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="password">
                {({ isActive }) => (
                  <div
                    className={`flex justify-between py-3 px-4 ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <p>Change your password</p>
                    <div className="text-on-surface/80">
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        <RiArrowRightSLine />
                      </IconContext.Provider>
                    </div>
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="display">
                {({ isActive }) => (
                  <div
                    className={`flex justify-between py-3 px-4 ${
                      isActive && 'bg-on-surface/10'
                    }`}
                  >
                    <p>Display</p>
                    <div className="text-on-surface/80">
                      <IconContext.Provider
                        value={{
                          size: '24px',
                          style: {
                            color: 'inherit',
                          },
                        }}
                      >
                        <RiArrowRightSLine />
                      </IconContext.Provider>
                    </div>
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
