import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FiX } from 'react-icons/fi';

import Backdrop from './Backdrop';

const Modal = ({
  children,
  isOpen,
  onDismiss,
  closeButtonVisible,
  title,
  customHeader,
  rounded,
  headerVisible,
}) => {
  return (
    <div className="relative" role="dialog" aria-modal="true">
      <Backdrop backdropVisible={isOpen} hideBackdrop={onDismiss} />
      <div
        className={`bg-surface fixed top-0 left-0 h-full w-full z-[999] overflow-y-auto sm:w-[500px] sm:h-fit sm:top-[20%] sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-[20%] ${
          !isOpen && 'hidden'
        } ${rounded && 'rounded-3xl'}`}
      >
        <div className="h-full sm:max-h-[90vh] sm:overflow-y-auto">
          {customHeader ||
            (headerVisible && (
              <div className="p-4 flex items-center relative">
                {closeButtonVisible && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="absolute top-1/2 -translate-y-1/2 text-on-surface"
                  >
                    <IconContext.Provider
                      // eslint-disable-next-line react/jsx-no-constructed-context-values
                      value={{
                        size: '32px',
                        style: {
                          color: 'inherit',
                        },
                      }}
                    >
                      <FiX />
                    </IconContext.Provider>
                  </button>
                )}
                <h1 className="text-on-surface font-bold text-2xl text-center flex-1">
                  {title}
                </h1>
              </div>
            ))}
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  onDismiss: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  closeButtonVisible: PropTypes.bool,
  title: PropTypes.string,
  customHeader: PropTypes.element,
  rounded: PropTypes.bool,
  headerVisible: PropTypes.bool,
};

Modal.defaultProps = {
  closeButtonVisible: true,
  onDismiss: () => {},
  title: 'Kookoo',
  customHeader: null,
  rounded: false,
  headerVisible: true,
};

export default Modal;
