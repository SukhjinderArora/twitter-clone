import { useMutation } from 'react-query';

import axios from '../utils/axios';

const useRepost = () => {
  return useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/repost', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });
};

export default useRepost;
