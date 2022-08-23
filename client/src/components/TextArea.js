import PropTypes from 'prop-types';

const autoExpandTextArea = (element) => {
  element.style.height = 'inherit';
  const computed = window.getComputedStyle(element);
  const height =
    parseInt(computed.getPropertyValue('border-top-width'), 10) +
    element.scrollHeight +
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
        aria-label={label}
        className="text-on-surface font-source-sans-pro text-xl border-0 bg-surface px-4 pt-3 pb-2 w-full rounded-md peer outline-none focus:border-primary min-h-[7rem] max-h-96 sm:min-h-[7rem] resize-none"
        placeholder={label}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={autoExpand ? handleChange : onChange}
        value={value}
      />
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
