import PropTypes from 'prop-types';

import TextInput from '../TextInput';
import Button from '../Button';

const Form2 = ({ formData, isLoading }) => {
  return (
    <form className="h-full relative" onSubmit={formData.handleSubmit}>
      <div className="mb-10">
        <h1 className="text-on-surface text-3xl font-bold mb-1">
          You&apos;ll need a password
        </h1>
        <h4 className="text-on-surface/75 text-sm">
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
        <Button type="submit" isLoading={isLoading}>
          Continue
        </Button>
      </div>
    </form>
  );
};

Form2.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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
  isLoading: PropTypes.bool.isRequired,
};

export default Form2;
