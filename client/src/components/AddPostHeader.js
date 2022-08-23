import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FiX } from 'react-icons/fi';

const AddPostHeader = ({ onDismiss }) => {
  return (
    <div className="px-4 py-2">
      <button type="button" onClick={onDismiss} className="text-on-surface">
        <IconContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{
            size: '24px',
            style: {
              color: 'inherit',
            },
          }}
        >
          <FiX />
        </IconContext.Provider>
      </button>
    </div>
  );
};

AddPostHeader.propTypes = {
  onDismiss: PropTypes.func,
};

AddPostHeader.defaultProps = {
  onDismiss: () => {},
};

export default AddPostHeader;
