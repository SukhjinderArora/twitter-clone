import { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';

import Fab from '../components/Fab';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import Post from '../components/Posts/Post';
import Repost from '../components/Posts/Repost';
import ComposePost from '../components/Posts/ComposePost';

import usePageTitle from '../hooks/usePageTitle';
import useScrollToTop from '../hooks/useScrollToTop';
import useInView from '../hooks/useInView';
import { useAuth } from '../contexts/auth-context';

import axios from '../utils/axios';

const Home = () => {
  useScrollToTop();
  const { setPageTitle } = usePageTitle('Home / Kookoo');
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { inView: lastPostInView, ref } = useInView({
    threshold: 0.2,
  });

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['posts', 'feed', user.id],
      async ({ pageParam = 1 }) => {
        try {
          const response = await axios.get(`/api/feed/home`, {
            params: {
              page: pageParam,
              limit: 5,
            },
          });
          return response.data;
        } catch (error) {
          return error;
        }
      },
      {
        getNextPageParam: (lastPage) => {
          const { nextPage } = lastPage.info;
          if (nextPage) return nextPage;
          return false;
        },
      }
    );

  useEffect(() => {
    if (lastPostInView && hasNextPage) {
      fetchNextPage();
    }
  }, [lastPostInView, hasNextPage, fetchNextPage]);

  const openModal = useCallback(() => {
    setModalOpen(true);
    navigate('/compose/post', {
      state: {
        backgroundLocation: location,
      },
      replace: true,
    });
  }, [location, navigate]);

  useEffect(() => {
    if (location.pathname === '/home') {
      setModalOpen(false);
      setPageTitle('Home / Kookoo');
    }
  }, [location.pathname, setPageTitle]);

  useEffect(() => {
    if (location.state?.from?.pathname === '/compose/post') {
      openModal();
    }
  }, [openModal, location.state?.from?.pathname]);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  return (
    <div
      className={`bg-background relative h-fit ${
        modalOpen ? 'pointer-events-none' : ''
      }`}
    >
      <div className="sticky top-0 left-0 w-full z-[100]">
        <PageHeader title="Home" />
      </div>
      <div className="border-b border-on-surface/30">
        <ComposePost />
      </div>
      <div className="mt-1 mb-14 pb-20">
        {data.pages[0].info.total === 0 && (
          <div className="mt-2">
            <h1 className="text-lg text-on-surface font-bold text-center px-20">
              Posts of people you follow will show up here.
            </h1>
          </div>
        )}
        {data.pages.map((group, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={i}>
              {group.results.map((post) =>
                post.post ? (
                  <Repost key={`${post.id}${post.post.id}`} repost={post} />
                ) : (
                  <Post post={post} key={post.id} />
                )
              )}
            </Fragment>
          );
        })}
        {hasNextPage && (
          <div ref={ref} className="h-2 text-center">
            <Spinner />
          </div>
        )}
      </div>
      <div className="fixed right-10 bottom-20 z-50">
        <Fab label="new post" onClick={openModal} />
      </div>
    </div>
  );
};

export default Home;
