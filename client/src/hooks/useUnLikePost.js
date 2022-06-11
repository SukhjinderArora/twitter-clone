import { useMutation } from 'react-query';

import axios from '../utils/axios';

const useUnLikePost = () => {
  return useMutation(async ({ postId }) => {
    try {
      const { data } = await axios.post('/api/post/unlike', {
        postId,
      });
      return data;
    } catch (error) {
      return error;
    }
  });
};

export default useUnLikePost;
