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
        className={`text-on-surface font-source-sans-pro border border-solid border-on-surface/25 bg-background px-4 pt-6 pb-2 w-full rounded-md peer outline-none focus:border-primary-dark ${
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
        className="text-sm text-on-surface absolute top-1 left-4 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base  peer-focus:top-1 peer-focus:text-sm transition-all peer-focus:text-primary pointer-events-none"
      >
        {label}
      </label>
      {type === 'username' && (
        <span className="font-source-sans-pro text-xl text-on-surface peer-placeholder-shown:hidden peer-focus:text-primary absolute left-3 top-5 peer-focus:inline-block inline-block">
          @
        </span>
      )}
      {type === 'username' && !error && (
        <span className="peer-placeholder-shown:hidden text-on-surface peer-focus:text-primary absolute right-0 top-7 mr-3">
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
      <span className="text-on-error text-xs inline-block w-full">{error}</span>
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
