import { useMutation } from 'react-query';

import axios from '../utils/axios';

const useLikePost = () => {
  return useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/like', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });
};

export default useLikePost;
