import PropTypes from 'prop-types';

const DropDownItem = ({ onClose, children }) => {
  return (
    <li>
      <button type="button" onClick={onClose}>
        {children}
      </button>
    </li>
  );
};

DropDownItem.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DropDownItem;
