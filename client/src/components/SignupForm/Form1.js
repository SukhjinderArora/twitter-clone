import PropTypes from 'prop-types';
import SelectInput from '../SelectInput';

import TextInput from '../TextInput';

const DateOptions = {
  months: [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ],
  year_range: 120,
  daysInMonth(month, year) {
    if (!month || !year) return [];
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({ value: String(i), label: String(i) });
    }
    return days;
  },
  getYearsInRange(yearRange) {
    const years = [];
    const currentYear = new Date().getFullYear();
    // eslint-disable-next-line no-plusplus
    for (let i = currentYear; i >= currentYear - yearRange; i--) {
      years.push({ value: String(i), label: String(i) });
    }
    return years;
  },
};

const Form1 = ({ formData, onButtonClick }) => {
  return (
    <form>
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold">Create your account</h1>
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
          onFocus={formData.handleFocus}
          onBlur={formData.handleBlur}
          onChange={formData.handleChange}
          value={formData.values.email}
          error={formData.touched.email ? formData.errors.email : ''}
        />
      </div>
      <div className="mb-4">
        <h3 className="text-base text-white font-semibold">Date of birth</h3>
      </div>
      <div className="flex justify-between gap-3 mb-4">
        <div className="w-1/2">
          <SelectInput
            id="month"
            name="month"
            value={formData.values.month}
            label="Month"
            onFocus={formData.handleFocus}
            onBlur={formData.handleBlur}
            onChange={formData.handleChange}
            error={formData.touched.month ? formData.errors.month : ''}
            options={DateOptions.months}
          />
        </div>
        <div className="w-1/4">
          <SelectInput
            id="day"
            name="day"
            value={formData.values.day}
            label="Day"
            onFocus={formData.handleFocus}
            onBlur={formData.handleBlur}
            onChange={formData.handleChange}
            error={formData.touched.day ? formData.errors.day : ''}
            options={DateOptions.daysInMonth(
              formData.values.month,
              formData.values.year
            )}
          />
        </div>
        <div className="w-1/4">
          <SelectInput
            id="year"
            name="year"
            value={formData.values.year}
            label="Year"
            onFocus={formData.handleFocus}
            onBlur={formData.handleBlur}
            onChange={formData.handleChange}
            error={formData.touched.year ? formData.errors.year : ''}
            options={DateOptions.getYearsInRange(DateOptions.year_range)}
          />
        </div>
      </div>
      <div>
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

Form1.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      name: PropTypes.bool.isRequired,
      email: PropTypes.bool.isRequired,
      month: PropTypes.bool.isRequired,
      day: PropTypes.bool.isRequired,
      year: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      month: PropTypes.string,
      day: PropTypes.string,
      year: PropTypes.string,
    }),
  }).isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

export default Form1;
