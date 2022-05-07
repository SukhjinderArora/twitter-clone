import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AuthProvider, useAuth } from './contexts/auth-context';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import SignupSuccess from './pages/SignupSuccess';

import Layout from './components/Layout';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <RequireAuth redirectTo="/signup">
                  <Home />
                </RequireAuth>
              }
            />
          </Route>
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn redirectTo="/">
                <Signup />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signin"
            element={
              <RedirectIfLoggedIn redirectTo="/">
                <Signin />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/signup/success" element={<SignupSuccess />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

const RequireAuth = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} />
  );
};

const RedirectIfLoggedIn = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <Navigate to={location.state?.from?.pathname || redirectTo} />
  ) : (
    children
  );
};

RequireAuth.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

RedirectIfLoggedIn.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

export default App;
