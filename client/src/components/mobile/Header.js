import PropTypes from 'prop-types';
import { RiSettings3Line } from 'react-icons/ri';
import { IconContext } from 'react-icons';

const Header = ({ pageTitle }) => {
  return (
    <div className="bg-surface h-14 flex justify-between items-center px-3">
      <div className="h-6 w-6 overflow-hidden sm:h-8 sm:w-8">
        <img
          className="h-full w-full rounded-full object-cover"
          src="https://i.pravatar.cc/300"
          alt="avatar"
        />
      </div>
      <div className="flex-1 ml-3">
        <h1 className="text-on-surface font-semibold sm:text-lg">
          {pageTitle}
        </h1>
      </div>
      <div className="text-on-surface">
        <IconContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{
            size: '24px',
            style: {
              color: 'inherit',
            },
          }}
        >
          <RiSettings3Line />
        </IconContext.Provider>
      </div>
    </div>
  );
};

Header.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default Header;
