import { useInfiniteQuery } from 'react-query';
import { useAuth } from '../contexts/auth-context';

import axios from '../utils/axios';

const getNotifications = async ({ pageParam = 1 }) => {
  try {
    const response = await axios.get(`/api/notification`, {
      params: {
        page: pageParam,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  return useInfiniteQuery('notifications', getNotifications, {
    getNextPageParam: (lastPage) => {
      const { nextPage } = lastPage.info;
      if (nextPage) return nextPage;
      return false;
    },
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });
};

export default useNotifications;
