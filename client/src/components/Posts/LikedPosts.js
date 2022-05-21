import { useEffect } from 'react';
import { useQuery, QueryClient } from 'react-query';
import { useOutletContext } from 'react-router-dom';

import axios from '../../utils/axios';

import Spinner from '../Spinner';
import Post from './Post';

const queryClient = new QueryClient();

const LikedPosts = () => {
  const { userId } = useOutletContext();
  const { data, isLoading, isError } = useQuery(
    ['posts', 'liked', userId],
    () => {
      return axios.get(`/api/users/${userId}/posts/liked`);
    }
  );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('posts');
    };
  }, []);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  const { likedPosts } = data.data;

  return (
    <div>
      {likedPosts.map((likedPost) => (
        <Post post={likedPost.post} key={likedPost.id} />
      ))}
    </div>
  );
};

export default LikedPosts;
