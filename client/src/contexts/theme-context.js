import * as React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const initialState = {
  primaryColor: {
    name: 'sky-blue',
    color: '#1d9bf0',
  },
  theme: { name: 'dark', bgColor: '#000000', fgColor: '#e7e9ea' },
  primaryColors: [
    {
      name: 'sky-blue',
      color: '#1d9bf0',
    },
    {
      name: 'yellow',
      color: '#ffd400',
    },
    {
      name: 'pink',
      color: '#f91880',
    },
    {
      name: 'violet',
      color: '#7856ff',
    },
    {
      name: 'orange',
      color: '#ff7a00',
    },
    {
      name: 'emerald',
      color: '#00ba7c',
    },
  ],
  themes: [
    { name: 'dark', bgColor: '#000000', fgColor: '#e7e9ea' },
    { name: 'dim', bgColor: '#16202a', fgColor: '#e7e9ea' },
    { name: 'light', bgColor: '#ffffff', fgColor: '#0f1419' },
  ],
};

const getInitialState = (initState) => {
  const state = localStorage.getItem('theme');
  return state ? JSON.parse(state) : initState;
};

const ThemeContext = React.createContext({
  ...initialState,
  setPrimaryColor: () => {},
  setTheme: () => {},
});

const ThemeReducer = (state, action) => {
  switch (action.type) {
    case 'setPrimaryColor': {
      return {
        ...state,
        primaryColor: initialState.primaryColors.find(
          (color) => color.name === action.payload.primaryColor
        ),
      };
    }
    case 'setTheme': {
      return {
        ...state,
        theme: initialState.themes.find((t) => t.name === action.payload.theme),
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const ThemeProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    ThemeReducer,
    initialState,
    getInitialState
  );

  useEffect(() => {
    document.documentElement.dataset.primaryColor = state.primaryColor.name;
    document.documentElement.dataset.theme = state.theme.name;
  }, [state]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(state));
  }, [state]);

  const setPrimaryColor = React.useCallback((primaryColor) => {
    dispatch({
      type: 'setPrimaryColor',
      payload: {
        primaryColor,
      },
    });
  }, []);

  const setTheme = React.useCallback((theme) => {
    dispatch({
      type: 'setTheme',
      payload: {
        theme,
      },
    });
  }, []);

  const value = React.useMemo(
    () => ({ ...state, setPrimaryColor, setTheme }),
    [state, setPrimaryColor, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

ThemeProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { ThemeProvider, useTheme };
