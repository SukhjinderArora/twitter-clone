import { useQuery } from 'react-query';

import axios from '../utils/axios';

const getUserByUsername = async (username) => {
  const { data } = await axios.get(`/api/users/user/${username}`);
  return data;
};

const useUser = (username) => {
  return useQuery(['user', username], () => getUserByUsername(username), {
    retry: (failureCount, error) => {
      if (error.response?.data?.error?.status === 404) return false;
      return 3;
    },
    refetchOnWindowFocus: false,
  });
};

export default useUser;
