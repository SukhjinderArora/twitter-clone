import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { RiAddLine } from 'react-icons/ri';

const Fab = ({ onClick, label }) => {
  return (
    <button
      type="button"
      aria-label={label}
      className="bg-primary text-on-primary p-5 rounded-full shadow-lg shadow-primary/15"
      onClick={onClick}
    >
      <IconContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          size: '24px',
          style: {
            color: 'inherit',
          },
        }}
      >
        <RiAddLine />
      </IconContext.Provider>
    </button>
  );
};

Fab.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

Fab.defaultProps = {
  label: 'button',
};

export default Fab;
