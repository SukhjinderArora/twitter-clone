/* eslint-disable react/jsx-no-constructed-context-values */
import { RiArrowLeftLine, RiArrowRightSLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { NavLink, useNavigate } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle';

const AccountInfo = () => {
  usePageTitle('Account information / Kookoo');
  const navigate = useNavigate();
  return (
    <div>
      <div className="px-4 py-4 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-on-surface"
            title="back"
          >
            <IconContext.Provider
              value={{
                size: '18px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiArrowLeftLine />
            </IconContext.Provider>
          </button>
          <header>
            <h3 className="text-xl font-semibold">Account information</h3>
          </header>
        </div>
      </div>
      <nav>
        <ul>
          <li className="pb-4">
            <NavLink to="/">
              <div className="flex justify-between items-center px-4">
                <div>
                  <p className="text-on-surface">Username</p>
                  <p className="text-sm text-on-surface/70 -mt-1">
                    @_sukh_arora
                  </p>
                </div>
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
            </NavLink>
          </li>
          <li className="pb-4">
            <NavLink to="/">
              <div className="flex justify-between items-center px-4">
                <div>
                  <p className="text-on-surface">Email</p>
                  <p className="text-sm text-on-surface/70 -mt-1">
                    test@test.com
                  </p>
                </div>
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
            </NavLink>
          </li>
          <li className="pb-4">
            <NavLink to="/">
              <div className="flex justify-between items-center px-4">
                <div>
                  <p className="text-on-surface">Birth date</p>
                  <p className="text-sm text-on-surface/70 -mt-1">
                    Jan 1, 1995
                  </p>
                </div>
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
            </NavLink>
          </li>
          <li className="pb-4">
            <NavLink to="/">
              <div className="flex justify-between items-center px-4">
                <div>
                  <p className="text-on-surface">Account creation</p>
                  <p className="text-sm text-on-surface/70 -mt-1">
                    Jun 6, 2020, 8:45 PM
                  </p>
                </div>
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
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountInfo;
