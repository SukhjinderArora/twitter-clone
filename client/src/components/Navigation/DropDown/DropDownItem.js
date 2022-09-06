import PropTypes from 'prop-types';

const DropDownItem = ({ onClose, children }) => {
  return (
    <li>
      <div role="button" tabIndex="0" onClick={onClose} onKeyDown={onClose}>
        {children}
      </div>
    </li>
  );
};

DropDownItem.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DropDownItem;
