import { useEffect } from 'react';
import { useQuery, QueryClient } from 'react-query';
import { useOutletContext } from 'react-router-dom';

import axios from '../../utils/axios';

import Spinner from '../Spinner';
import Post from './Post';

const queryClient = new QueryClient();

const PostsByUser = () => {
  const { userId } = useOutletContext();
  const { data, isLoading, isError } = useQuery(['posts', userId], () => {
    return axios.get(`/api/users/${userId}/posts`);
  });

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

  const { posts } = data.data;

  return (
    <div>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostsByUser;
