import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FiX } from 'react-icons/fi';

import Backdrop from './Backdrop';

const Modal = ({ children, closeModal, modalOpen }) => {
  return (
    <div className="relative">
      <Backdrop backdropVisible={modalOpen} hideBackdrop={closeModal} />
      <div
        className={`bg-neutral-900 fixed top-0 left-0 h-full w-full z-20 sm:w-[500px] sm:h-fit sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 ${
          !modalOpen && 'hidden'
        }`}
      >
        <div className="p-4 flex items-center relative">
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-1/2 -translate-y-1/2 text-neutral-100"
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
          <h1 className="text-neutral-100 font-bold text-2xl text-center flex-1">
            Kookoo
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
};

export default Modal;
