import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';

import useForm from '../../hooks/useForm';

const validateForm1 = (values) => {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = 'This is a mandatory field';
  }
  if (!values.email.trim()) {
    errors.email = 'This is a mandatory field';
  }
  if (!values.month.trim()) {
    errors.month = 'This is a mandatory field';
  }
  if (!values.day.trim()) {
    errors.day = 'This is a mandatory field';
  }
  if (!values.year.trim()) {
    errors.year = 'This is a mandatory field';
  }
  return errors;
};

const validateForm2 = (values) => {
  const errors = {};
  if (!values.password.trim()) {
    errors.password = 'This is a mandatory field';
  }
  return errors;
};

const SignupForm = () => {
  const form1 = useForm({
    initialValues: {
      name: '',
      email: '',
      month: '',
      day: '',
      year: '',
    },
    validate: validateForm1,
  });
  const form2 = useForm({
    initialValues: {
      password: '',
    },
    validate: validateForm2,
  });
  return (
    <div className="h-full w-full z-20 sm:w-[500px] sm:h-[500px] p-6">
      {/* <Form1 formData={form1} /> */}
      <Form2 formData={form2} />
      {/* <Form3 /> */}
    </div>
  );
};

export default SignupForm;
