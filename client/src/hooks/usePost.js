import { useQuery } from 'react-query';

import axios from '../utils/axios';

const getPostById = async (postId) => {
  try {
    const response = await axios.get(`/api/post/${postId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const usePost = (postId) => {
  return useQuery(['post', postId], () => getPostById(postId), {
    refetchOnWindowFocus: false,
  });
};

export default usePost;
