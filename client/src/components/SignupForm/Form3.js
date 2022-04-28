import PropTypes from 'prop-types';

import TextInput from '../TextInput';

const Form3 = ({ formData, onButtonClick }) => {
  return (
    <form className="h-full relative">
      <div className="mb-10">
        <h1 className="text-neutral-100 text-3xl font-bold mb-1">
          What should we call you?
        </h1>
        <h4 className="text-neutral-400 text-sm">
          Your @username is unique. You can always change is later.
        </h4>
      </div>
      <div className="mb-4">
        <TextInput
          id="username"
          name="username"
          label="Username"
          onFocus={formData.handleFocus}
          onBlur={formData.handleBlur}
          onChange={formData.handleChange}
          value={formData.values.username}
          type="username"
          error={formData.touched.username ? formData.errors.username : ''}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <button
          type="button"
          onClick={onButtonClick}
          className="font-raleway bg-primary-500 text-primary-100 rounded-full font-semibold block w-full py-4"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

Form3.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      username: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default Form3;
