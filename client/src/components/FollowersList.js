import { useEffect, Fragment } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useOutletContext } from 'react-router-dom';

import axios from '../utils/axios';

import Spinner from './Spinner';
import User from './User';

import useInView from '../hooks/useInView';

const FollowersList = () => {
  const { userId } = useOutletContext();
  const queryClient = useQueryClient();
  const { inView: lastUserInView, ref } = useInView({
    threshold: 0.2,
  });
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['followers', userId],
      async ({ pageParam = 1 }) => {
        try {
          const response = await axios.get(`/api/users/${userId}/followers`, {
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
    return () => {
      queryClient.invalidateQueries('followers');
    };
  }, [queryClient]);

  useEffect(() => {
    if (lastUserInView && hasNextPage) {
      fetchNextPage();
    }
  }, [lastUserInView, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  return (
    <div>
      {data.pages[0].info.total === 0 && (
        <div>
          <h1 className="text-lg text-on-surface font-bold">
            This user doesn&apos;t have any followers yet.
          </h1>
        </div>
      )}
      {data.pages.map((group, i) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            {group.results.map((user) => (
              <User user={user} key={user.id} />
            ))}
          </Fragment>
        );
      })}
      {hasNextPage && (
        <div ref={ref} className="h-2 text-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default FollowersList;
