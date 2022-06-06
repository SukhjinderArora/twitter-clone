import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import axios from '../../utils/axios';

import SelectedPost from './SelectedPost';
import Post from './Post';
import Spinner from '../Spinner';

const PostDetail = () => {
  const { postId } = useParams();
  const { data, isLoading, isError } = useQuery(['post', postId], async () => {
    try {
      const response = await axios.get(`/api/post/${postId}`);
      return response.data;
    } catch (error) {
      return error;
    }
  });
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  return (
    <div className="pb-14">
      <SelectedPost post={data} />
      {data.replies.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostDetail;
