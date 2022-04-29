import PropTypes from 'prop-types';

import TextArea from '../TextArea';

const Form4 = ({ formData }) => {
  return (
    <form className="h-full relative" onSubmit={formData.handleSubmit}>
      <div className="mb-10">
        <h1 className="text-on-surface text-3xl font-bold mb-1">
          Describe yourself
        </h1>
        <h4 className="text-on-surface text-sm">
          What makes you special? Don&apos;t think too hard, just have fun with
          it.
        </h4>
      </div>
      <div className="mb-4">
        <TextArea
          id="bio"
          name="bio"
          label="Your bio"
          onFocus={formData.handleFocus}
          onBlur={formData.handleBlur}
          onChange={formData.handleChange}
          value={formData.values.bio}
          error={formData.touched.bio ? formData.errors.bio : ''}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <button
          type="submit"
          className="font-raleway bg-primary text-on-primary rounded-full font-semibold block w-full py-4"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

Form4.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    values: PropTypes.shape({
      bio: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      bio: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      bio: PropTypes.string,
    }),
  }).isRequired,
};

export default Form4;
