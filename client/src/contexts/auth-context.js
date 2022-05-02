import * as React from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext({
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  // eslint-disable-next-line no-unused-vars
  login: (user = {}, token = '') => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      return {
        user: action.payload.user,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        isAuthenticated: true,
      };
    }
    case 'logout': {
      return {
        user: null,
        token: null,
        expiresAt: null,
        isAuthenticated: false,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    user: null,
    token: null,
    expiresAt: null,
    isAuthenticated: false,
  });
  const login = (user, token, expiresAt) => {
    dispatch({
      type: 'login',
      payload: {
        user,
        token,
        expiresAt,
      },
    });
  };
  const logout = () => {
    dispatch({
      type: 'logout',
    });
  };
  const value = React.useMemo(() => ({ ...state, login, logout }), [state]);
  // const value = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
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
