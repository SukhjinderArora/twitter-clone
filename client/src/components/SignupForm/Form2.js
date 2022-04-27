import PropTypes from 'prop-types';

import TextInput from '../TextInput';

const Form2 = ({ formData, onButtonClick }) => {
  return (
    <form className="h-full relative">
      <div className="mb-10">
        <h1 className="text-white text-3xl font-bold mb-1">
          You&apos;ll need a password
        </h1>
        <h4 className="text-gray-400 text-sm">
          Make sure it&apos;s 8 characters or more.
        </h4>
      </div>
      <div className="mb-4">
        <TextInput
          id="password"
          name="password"
          label="Password"
          onFocus={formData.handleFocus}
          onBlur={formData.handleBlur}
          onChange={formData.handleChange}
          value={formData.values.password}
          type="password"
          error={formData.touched.password ? formData.errors.password : ''}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <button
          type="button"
          onClick={onButtonClick}
          className="font-raleway bg-sky-600 text-sky-50 rounded-full font-semibold block w-full py-4"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

Form2.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      password: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      password: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      password: PropTypes.string,
    }),
  }).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default Form2;
