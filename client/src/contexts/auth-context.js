import * as React from 'react';
import PropTypes from 'prop-types';

import { STATUS } from '../utils/utils';
import { setToken, clearToken } from '../utils/auth';

const initialState = {
  user: {
    profile: {},
  },
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
  updateUser: () => {},
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
    case 'updateUser': {
      return {
        ...state,
        user: action.payload.user,
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
    setToken(token);
  }, []);
  const logout = React.useCallback(() => {
    dispatch({
      type: 'logout',
    });
  }, []);
  const updateUser = React.useCallback((user) => {
    dispatch({
      type: 'updateUser',
      payload: {
        user,
      },
    });
  }, []);
  const setAuthenticationStatus = React.useCallback((status) => {
    dispatch({
      type: 'status',
      payload: {
        status,
      },
    });
    clearToken();
  }, []);
  const value = React.useMemo(
    () => ({ ...state, login, logout, updateUser, setAuthenticationStatus }),
    [state, setAuthenticationStatus, login, logout, updateUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { AuthProvider, useAuth };
