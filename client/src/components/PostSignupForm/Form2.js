import PropTypes from 'prop-types';

import TextInput from '../TextInput';
import Button from '../Button';

const Form2 = ({ formData, isLoading }) => {
  return (
    <form className="h-full relative" onSubmit={formData.handleSubmit}>
      <div className="mb-10">
        <h1 className="text-on-surface text-3xl font-bold mb-1">
          What should we call you?
        </h1>
        <h4 className="text-on-surface/75 text-sm">
          Your @username is unique. You can always change it later.
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
      username: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      username: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool,
};

Form2.defaultProps = {
  isLoading: false,
};

export default Form2;
