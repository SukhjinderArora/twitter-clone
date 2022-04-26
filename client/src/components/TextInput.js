import PropTypes from 'prop-types';

const TextInput = ({
  id,
  name,
  label,
  value,
  type,
  error,
  onFocus,
  onBlur,
  onChange,
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        className={`text-gray-100 border border-solid border-gray-600 bg-black px-4 pt-6 pb-2 w-full rounded-md peer focus:outline focus:outline-1 focus:outline-sky-600 ${
          type === 'password' ? 'font-verdana text-2xl tracking-tighter' : ''
        }`}
        placeholder="   "
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={id}
        className="text-sm text-gray-300 absolute top-1 left-4 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base  peer-focus:top-1 peer-focus:text-sm transition-all peer-focus:text-sky-600"
      >
        {label}
      </label>
      <span className="text-red-500 text-xs inline-block w-full">{error}</span>
    </div>
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'search',
    'tel',
    'url',
    'number',
  ]),
  error: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

TextInput.defaultProps = {
  error: '',
  type: 'text',
};

export default TextInput;
