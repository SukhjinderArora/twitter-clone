import PropTypes from 'prop-types';

const TextArea = ({
  id,
  name,
  label,
  value,
  error,
  onFocus,
  onBlur,
  onChange,
}) => {
  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        className="text-on-surface font-source-sans-pro border border-solid border-on-surface/25 bg-surface px-4 pt-6 pb-2 w-full rounded-md peer outline-none focus:border-primary max-h-96"
        placeholder="   "
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={id}
        className="text-sm text-on-surface absolute top-1 left-4 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base  peer-focus:top-1 peer-focus:text-sm transition-all peer-focus:text-primary"
      >
        {label}
      </label>
      <span className="text-on-error text-xs inline-block w-full">{error}</span>
    </div>
  );
};

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

TextArea.defaultProps = {
  error: '',
};

export default TextArea;
