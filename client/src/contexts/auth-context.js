import * as React from 'react';
import PropTypes from 'prop-types';

import { STATUS } from '../utils/utils';

const initialState = {
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  status: STATUS.PENDING,
};

const AuthContext = React.createContext({
  ...initialState,
  // eslint-disable-next-line no-unused-vars
  login: (user = {}, token = '', expiresAt = '') => {},
  logout: () => {},
  setAuthenticationStatus: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      return {
        user: action.payload.user,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        isAuthenticated: true,
        verifyingToken: false,
        status: STATUS.SUCCEEDED,
      };
    }
    case 'logout': {
      return {
        ...initialState,
        status: STATUS.IDLE,
      };
    }
    case 'status': {
      return {
        ...state,
        status: action.payload.status,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  const login = React.useCallback((user, token, expiresAt) => {
    dispatch({
      type: 'login',
      payload: {
        user,
        token,
        expiresAt,
      },
    });
  }, []);
  const logout = React.useCallback(() => {
    dispatch({
      type: 'logout',
    });
  }, []);
  const setAuthenticationStatus = React.useCallback((status) => {
    dispatch({
      type: 'status',
      payload: {
        status,
      },
    });
  }, []);
  const value = React.useMemo(
    () => ({ ...state, login, logout, setAuthenticationStatus }),
    [state, setAuthenticationStatus, login, logout]
  );
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
