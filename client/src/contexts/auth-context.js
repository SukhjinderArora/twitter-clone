import * as React from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext({ isAuthenticated: false });

const authReducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      return { isAuthenticated: true };
    }
    case 'logout': {
      return { isAuthenticated: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    isAuthenticated: false,
  });
  const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { AuthProvider, useAuth };
