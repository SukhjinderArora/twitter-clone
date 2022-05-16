import axios from './axios';

const setToken = (accessToken) => {
  axios.defaults.headers.common[
    // eslint-disable-next-line dot-notation
    'Authorization'
  ] = `Bearer ${accessToken}`;
};

const clearToken = () => {
  delete axios.defaults.headers.common[
    // eslint-disable-next-line dot-notation
    'Authorization'
  ];
};

export { setToken, clearToken };
