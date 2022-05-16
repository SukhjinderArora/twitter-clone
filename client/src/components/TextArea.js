import PropTypes from 'prop-types';

const autoExpandTextArea = (element) => {
  element.style.height = 'inherit';
  const computed = window.getComputedStyle(element);
  const height =
    parseInt(computed.getPropertyValue('border-top-width'), 10) +
    parseInt(computed.getPropertyValue('padding-top'), 10) +
    element.scrollHeight +
    parseInt(computed.getPropertyValue('padding-bottom'), 10) +
    parseInt(computed.getPropertyValue('border-bottom-width'), 10);
  element.style.height = `${height}px`;
};

const TextArea = ({
  id,
  name,
  label,
  value,
  error,
  autoExpand,
  onFocus,
  onBlur,
  onChange,
}) => {
  const handleChange = (evt) => {
    autoExpandTextArea(evt.target);
    onChange(evt);
  };
  return (
    <div className="relative">
      <textarea
        id={id}
        name={name}
        className="text-on-surface font-source-sans-pro border border-solid border-on-surface/25 bg-surface px-4 pt-6 pb-2 w-full rounded-md peer outline-none focus:border-primary min-h-[12rem] max-h-96 sm:min-h-[7rem]"
        placeholder="   "
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={autoExpand ? handleChange : onChange}
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
  autoExpand: PropTypes.bool,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

TextArea.defaultProps = {
  error: '',
  autoExpand: false,
};

export default TextArea;
