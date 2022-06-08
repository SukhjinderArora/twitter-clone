import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import axios from '../utils/axios';

import SelectedPost from '../components/Posts/SelectedPost';
import Post from '../components/Posts/Post';
import Spinner from '../components/Spinner';

const PostDetail = () => {
  const { postId } = useParams();
  const selectedPostRef = useRef(null);
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
      onSuccess: () => {
        selectedPostRef.current.scrollIntoView({ behavior: 'smooth' });
      },
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
    const ancestorPostsArray = [];
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
      <div ref={selectedPostRef}>
        <SelectedPost post={post.data} />
      </div>
      {childPosts.isSuccess && renderChildPosts()}
    </div>
  );
};

export default PostDetail;
