/* eslint-disable react/jsx-no-constructed-context-values */
import PropTypes from 'prop-types';
import { RiCheckLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';

const RadioButton = ({
  id,
  name,
  value,
  selected,
  radioBtnChangeHandler,
  size,
  bgColor,
  fgColor,
  borderColor,
}) => {
  return (
    <label
      className="rounded-full relative cursor-pointer inline-block"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        color: fgColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className="hidden"
        checked={selected}
        onChange={(e) => radioBtnChangeHandler(id, value, e)}
        aria-label={name}
      />
      <div
        className={`w-full h-full scale-0 transition-transform ${
          selected && 'scale-100'
        }`}
      >
        <IconContext.Provider
          value={{
            style: {
              color: 'inherit',
              height: '100%',
              width: '100%',
            },
          }}
        >
          <RiCheckLine />
        </IconContext.Provider>
      </div>
    </label>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  radioBtnChangeHandler: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  borderColor: PropTypes.string,
};

RadioButton.defaultProps = {
  bgColor: '#1d9bf0',
  fgColor: '#fff',
  borderColor: 'transparent',
};

export default RadioButton;
