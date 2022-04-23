/* eslint-disable no-console */
const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

const warn = (...params) => {
  console.warn(...params);
};

export { info, error, warn };
