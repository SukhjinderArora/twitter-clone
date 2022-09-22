import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';
import useMediaQuery from '../hooks/useMediaQuery';

const PageHeader = ({ title }) => {
  const [, setOpenSideDrawer] = useOutletContext();
  const { user } = useAuth();
  const isMobileDevice = useMediaQuery('(max-width: 639px)');

  return (
    <div className="bg-surface h-14 flex justify-between items-center px-3">
      <button
        type="button"
        className="h-6 w-6 overflow-hidden sm:h-8 sm:w-8"
        onClick={isMobileDevice ? () => setOpenSideDrawer(true) : null}
      >
        <img
          className="h-full w-full rounded-full object-cover"
          src={user.profile.img}
          alt="avatar"
        />
      </button>
      <div className="flex-1 ml-3">
        <h1 className="text-on-surface font-semibold sm:text-lg">{title}</h1>
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageHeader;
