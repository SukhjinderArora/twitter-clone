import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import axios from '../../utils/axios';

import SelectedPost from './SelectedPost';
import Post from './Post';
import Spinner from '../Spinner';

const PostDetail = () => {
  const { postId } = useParams();
  const ancestorPostsArray = [];

  const post = useQuery(['post', postId], async () => {
    try {
      const response = await axios.get(`/api/post/${postId}`);
      return response.data;
    } catch (error) {
      return error;
    }
  });

  const ancestorPosts = useQuery(
    ['posts', 'ancestors', postId],
    async () => {
      try {
        const response = await axios.get(`/api/post/${postId}/ancestors`);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    {
      enabled: !!post.data?.id,
    }
  );

  const childPosts = useQuery(
    ['posts', 'children', postId],
    async () => {
      try {
        const response = await axios.get(`/api/post/${postId}/children`);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    {
      enabled: !!post.data?.id,
    }
  );

  const renderAncestorPosts = () => {
    let head = ancestorPosts.data;
    while (head !== null) {
      ancestorPostsArray.unshift(head.post);
      head = head.next;
    }
    return ancestorPostsArray.map((ancestorPost) => (
      <Post post={ancestorPost} key={ancestorPost.id} />
    ));
  };

  const renderChildPosts = () => {
    return childPosts.data.map((childPost) => (
      <Post post={childPost} key={childPost.id} />
    ));
  };

  if (post.isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (post.isError) return <div>Something went wrong.</div>;

  return (
    <div className="pb-14">
      {ancestorPosts.isSuccess && renderAncestorPosts()}
      <SelectedPost post={post.data} />
      {childPosts.isSuccess && renderChildPosts()}
    </div>
  );
};

export default PostDetail;
