import PropTypes from 'prop-types';

import Button from '../Button';
import TextInput from '../TextInput';

const Form1 = ({ formData, isLoading }) => {
  return (
    <form className="h-full relative" onSubmit={formData.handleSubmit}>
      <div className="mb-6">
        <h1 className="text-on-surface text-3xl font-bold">
          Create your account
        </h1>
      </div>
      <div className="mb-4">
        <TextInput
          id="name"
          name="name"
          label="Name"
          onFocus={formData.handleFocus}
          onBlur={formData.handleBlur}
          onChange={formData.handleChange}
          value={formData.values.name}
          error={formData.touched.name ? formData.errors.name : ''}
        />
      </div>
      <div className="mb-4">
        <TextInput
          id="email"
          name="email"
          label="Email"
          type="email"
          onFocus={formData.handleFocus}
          onBlur={formData.handleBlur}
          onChange={formData.handleChange}
          value={formData.values.email}
          error={formData.touched.email ? formData.errors.email : ''}
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

Form1.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    values: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      name: PropTypes.bool.isRequired,
      email: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool,
};

Form1.defaultProps = {
  isLoading: false,
};

export default Form1;
