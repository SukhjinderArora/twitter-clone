import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import axios from '../utils/axios';

import SelectedPost from '../components/Posts/SelectedPost';
import ReplyToPost from '../components/Posts/ReplyToPost';
import Post from '../components/Posts/Post';
import Spinner from '../components/Spinner';

import { useAuth } from '../contexts/auth-context';

const PostDetail = () => {
  const { postId } = useParams();
  const selectedPostRef = useRef(null);
  const isInitialRender = useRef(true);
  const { isAuthenticated } = useAuth();
  const post = useQuery(
    ['post', postId],
    async () => {
      try {
        const response = await axios.get(`/api/post/${postId}`);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const ancestorPosts = useQuery(
    ['post', 'ancestors', postId],
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
      refetchOnWindowFocus: false,
    }
  );

  const childPosts = useQuery(
    ['post', 'children', postId],
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
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (ancestorPosts.isSuccess && isInitialRender.current) {
      selectedPostRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      isInitialRender.current = false;
    }
  }, [ancestorPosts.isSuccess]);

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
      {isAuthenticated && (
        <div>
          <ReplyToPost post={post.data} />
        </div>
      )}
      {childPosts.isSuccess && renderChildPosts()}
    </div>
  );
};

export default PostDetail;
