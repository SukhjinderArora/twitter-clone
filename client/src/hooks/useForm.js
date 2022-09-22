import { useEffect, useReducer, useCallback } from 'react';

import { setAllObjectProperties, checkIfEmpty } from '../utils/utils';
import * as logger from '../utils/logger';

const actionTypes = {
  TOUCHED: 'touched',
  CHANGE: 'change',
  RESET: 'reset',
  ERROR: 'error',
  TOUCHALL: 'touchall',
  FOCUSED: 'focused',
};

const init = (initialValues = {}) => {
  return {
    values: initialValues,
    errors: {},
    touched: setAllObjectProperties(initialValues, false),
    focused: setAllObjectProperties(initialValues, false),
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOUCHED:
      return {
        ...state,
        touched: { ...state.touched, [action.input.name]: true },
      };
    case actionTypes.FOCUSED:
      return {
        ...state,
        focused: { ...state.focused, [action.input.name]: action.input.value },
      };
    case actionTypes.CHANGE:
      return {
        ...state,
        values: { ...state.values, [action.input.name]: action.input.value },
      };
    case actionTypes.RESET:
      return action.initialState;
    case actionTypes.ERROR:
      return { ...state, errors: action.errors };
    case actionTypes.TOUCHALL: {
      const alreadyTouched = Object.values(state.touched).every(
        (x) => x === true
      );
      if (alreadyTouched) return state;
      const touched = setAllObjectProperties(state.touched, true);
      return { ...state, touched };
    }
    default:
      return state;
  }
};

const defaultValidationFunction = () => ({});

const defaultSubmitFunction = () => {
  logger.warn('Please pass the onSubmit function as the function argument');
};

const useForm = ({
  initialValues = {},
  validate = defaultValidationFunction,
  onSubmit = defaultSubmitFunction,
} = {}) => {
  const [{ values, errors, touched, focused }, dispatch] = useReducer(
    reducer,
    initialValues,
    init
  );

  useEffect(() => {
    const formErrors = validate(values);
    dispatch({
      type: actionTypes.ERROR,
      errors: { ...formErrors },
    });
  }, [values, touched, validate]);

  const handleFocus = useCallback((evt) => {
    dispatch({
      type: actionTypes.FOCUSED,
      input: {
        name: evt.target.name,
        value: true,
      },
    });
  }, []);

  const handleBlur = useCallback((evt) => {
    dispatch({
      type: actionTypes.TOUCHED,
      input: {
        name: evt.target.name,
      },
    });
    dispatch({
      type: actionTypes.FOCUSED,
      input: {
        name: evt.target.name,
        value: false,
      },
    });
  }, []);

  const handleChange = useCallback((evt) => {
    let value;
    if (evt.target.type === 'file') {
      // eslint-disable-next-line prefer-destructuring
      value = evt.target.files[0];
    } else if (evt.target.type === 'checkbox') {
      value = evt.target.checked;
    } else {
      value = evt.target.value;
    }
    dispatch({
      type: actionTypes.CHANGE,
      input: {
        name: evt.target.name,
        value,
      },
    });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({
      type: actionTypes.RESET,
      initialState: init(initialValues),
    });
  }, [initialValues]);

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      dispatch({
        type: actionTypes.TOUCHALL,
      });
      if (checkIfEmpty(errors)) {
        onSubmit(values, { resetForm });
      }
    },
    [errors, onSubmit, resetForm, values]
  );

  const setFieldError = useCallback((fieldName, errorMessage) => {
    dispatch({
      type: actionTypes.ERROR,
      errors: {
        [fieldName]: errorMessage,
      },
    });
  }, []);

  const setMultipleFieldsError = useCallback((formErrors = {}) => {
    dispatch({
      type: actionTypes.ERROR,
      errors: {
        ...formErrors,
      },
    });
  }, []);

  return {
    values,
    errors,
    touched,
    focused,
    handleFocus,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldError,
    setMultipleFieldsError,
  };
};

export default useForm;
