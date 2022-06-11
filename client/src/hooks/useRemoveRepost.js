import { useMutation } from 'react-query';

import axios from '../utils/axios';

const useRemoveRepost = () => {
  return useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/repost/remove', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });
};

export default useRemoveRepost;
