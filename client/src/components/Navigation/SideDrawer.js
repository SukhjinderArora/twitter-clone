import PropTypes from 'prop-types';

import Backdrop from '../Backdrop';

const SideDrawer = ({ children, direction, isOpen, onDismiss }) => {
  return (
    <div>
      <Backdrop backdropVisible={isOpen} hideBackdrop={onDismiss} />
      <div
        className={`max-w-xs w-full h-full overflow-scroll fixed top-0 z-[500] bg-surface transition-transform duration-300 ease-in ${
          direction === 'right'
            ? 'right-0 translate-x-full'
            : 'left-0 -translate-x-full'
        } ${isOpen && 'translate-x-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

SideDrawer.propTypes = {
  children: PropTypes.element.isRequired,
  direction: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default SideDrawer;
