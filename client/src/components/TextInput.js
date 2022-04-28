import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const inputTypes = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
];

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
        type={inputTypes.includes(type) ? type : 'text'}
        id={id}
        name={name}
        className={`text-neutral-100 font-lato border border-solid border-neutral-500 bg-neutral-900 px-4 pt-6 pb-2 w-full rounded-md peer focus:outline focus:outline-1 focus:outline-primary-600 ${
          type === 'password' ? 'font-verdana text-2xl tracking-tighter' : ''
        } ${type === 'username' ? 'pl-8 pr-8' : ''}`}
        placeholder="   "
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={id}
        className="text-sm text-neutral-300 absolute top-1 left-4 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base  peer-focus:top-1 peer-focus:text-sm transition-all peer-focus:text-primary-500"
      >
        {label}
      </label>
      {type === 'username' && (
        <span className="font-lato text-xl text-neutral-200 peer-placeholder-shown:hidden peer-focus:text-sky-600 absolute left-3 top-5 peer-focus:inline-block inline-block">
          @
        </span>
      )}
      {type === 'username' && !error && (
        <span className="peer-placeholder-shown:hidden text-neutral-100 peer-focus:text-primary-500 absolute right-0 top-7 mr-3">
          <IconContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
              style: {
                color: 'inherit',
              },
            }}
          >
            <FaCheckCircle />
          </IconContext.Provider>
        </span>
      )}
      <span className="text-error text-xs inline-block w-full">{error}</span>
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
    'username',
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
