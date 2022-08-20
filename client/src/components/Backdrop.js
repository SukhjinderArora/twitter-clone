import PropTypes from 'prop-types';

const Backdrop = ({ backdropVisible, hideBackdrop }) => {
  return (
    <div
      onClick={hideBackdrop}
      aria-hidden="true"
      className={`fixed top-0 left-0 h-full w-full z-[500] bg-[#5b7083] transition-all ease-[0.175, 0.885, 0.32, 1.275] duration-300 ${
        backdropVisible ? 'opacity-40 visible' : 'opacity-0 invisible'
      }`}
    />
  );
};

Backdrop.propTypes = {
  backdropVisible: PropTypes.bool.isRequired,
  hideBackdrop: PropTypes.func.isRequired,
};

export default Backdrop;
