import { Link } from 'react-router-dom';

import TextInput from '../components/TextInput';

import useForm from '../hooks/useForm';

const validate = (values) => {
  const errors = {};
  if (!values.username.trim()) {
    errors.username = 'This is a mandatory field';
  }
  if (!values.password.trim()) {
    errors.password = 'This is a mandatory field';
  }
  return errors;
};

const Signin = () => {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className="bg-background h-screen py-10 px-10 flex justify-center items-center">
      <div className="max-w-xs w-full">
        <div className="mb-4">
          <h3 className="text-on-background text-3xl font-black text-center">
            Sign in to Kookoo
          </h3>
        </div>
        <div className="mb-4">
          <a
            href="http://localhost:5000/api/auth/login/google"
            className="text-neutral-800 bg-white py-4 flex justify-center gap-4 text-base font-normal rounded-full font-lato"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            <span>Sign in with Google</span>
          </a>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-on-background h-px flex-1" />
          <div className="text-on-background">or</div>
          <div className="bg-on-background h-px flex-1" />
        </div>
        <div>
          <form className="mb-8">
            <div className="relative mb-4">
              <TextInput
                id="username"
                name="username"
                label="Email or username"
                value={form.values.username}
                error={form.touched.username ? form.errors.username : ''}
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
              />
            </div>
            <div className="relative mb-4">
              <TextInput
                id="password"
                name="password"
                label="Password"
                type="password"
                value={form.values.password}
                error={form.touched.password ? form.errors.password : ''}
                onFocus={form.handleFocus}
                onBlur={form.handleBlur}
                onChange={form.handleChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="font-raleway bg-primary text-on-primary rounded-full font-semibold block w-full py-4"
              >
                Sign in
              </button>
            </div>
          </form>
          <div>
            <span className="text-on-background text-base mb-2">
              Don&apos;t have an account?
            </span>
            <Link
              to="/signup"
              className="font-raleway text-primary inline-block ml-1 font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
