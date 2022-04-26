import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FiChevronDown } from 'react-icons/fi';

const SelectInput = ({
  id,
  name,
  label,
  value,
  error,
  options,
  onChange,
  onBlur,
  onFocus,
}) => {
  return (
    <div>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className="text-gray-100 border border-solid border-gray-600 bg-black px-4 pt-6 pb-2 w-full rounded-md appearance-none peer focus:outline focus:outline-1 focus:outline-sky-600 cursor-pointer"
        >
          <option value="" disabled>
            {' '}
          </option>
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className="text-sm text-gray-300 absolute top-1 left-4 transition-all peer-focus:text-sky-600 pointer-events-none"
        >
          {label}
        </label>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 mr-1 text-[#71767b] peer-focus:text-sky-600 pointer-events-none">
          <IconContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
              size: '32px',
              style: {
                color: 'inherit',
              },
            }}
          >
            <FiChevronDown />
          </IconContext.Provider>
        </div>
      </div>
      <span className="text-red-500 text-xs inline-block w-full">{error}</span>
    </div>
  );
};

SelectInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

SelectInput.defaultProps = {
  error: '',
};

export default SelectInput;
