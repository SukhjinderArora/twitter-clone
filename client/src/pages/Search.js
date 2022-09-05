import { useState, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';

import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import User from '../components/User';

import axios from '../utils/axios';

import useDebounce from '../hooks/useDebounce';
import usePageTitle from '../hooks/usePageTitle';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  usePageTitle('Search / Kookoo');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['search', debouncedSearchTerm],
    async ({ queryKey, pageParam = 1 }) => {
      const name = queryKey[1];
      if (name.startsWith('@')) {
        const response = await axios.get(
          `/api/search/users/by/username/${name.substring(1)}`,
          {
            params: {
              page: pageParam,
            },
          }
        );
        return response.data;
      }
      const response = await axios.get(`/api/search/users/by/name/${name}`, {
        params: {
          page: pageParam,
        },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage) => {
        const { nextPage } = lastPage.info;
        if (nextPage) return nextPage;
        return false;
      },
      enabled: !!debouncedSearchTerm,
      refetchOnWindowFocus: false,
    }
  );

  const inputChangeHandler = (evt) => {
    setSearchTerm(evt.target.value);
  };

  return (
    <div>
      <div className="sticky top-0 left-0 w-full z-50">
        <PageHeader title="Search" />
      </div>
      <div className="mt-4 pb-20">
        <form>
          <div className="relative max-w-[80%] my-0 mx-auto text-on-surface/50 focus-within:text-primary">
            <div className="absolute top-1/2 -translate-y-1/2 left-2">
              <IconContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{
                  size: '16px',
                  style: {
                    color: 'inherit',
                  },
                }}
              >
                <RiSearchLine />
              </IconContext.Provider>
            </div>
            <div>
              <input
                type="text"
                aria-label="Search Users"
                placeholder="Search people by name or username"
                id="search"
                name="search"
                className="w-full py-1 pl-8 pr-2 rounded-3xl bg-on-surface/20 text-on-surface placeholder-on-surface/50 outline-none border border-transparent focus:border-primary focus:bg-surface"
                autoComplete="off"
                autoCorrect="off"
                value={searchTerm}
                onChange={inputChangeHandler}
              />
            </div>
          </div>
        </form>
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center mt-3">
            <Spinner />
          </div>
        )}
        {isSuccess && (
          <div className="max-w-[80%] mx-auto">
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
            {!hasNextPage && (
              <div className="mt-2">
                <Link
                  to={`/${
                    debouncedSearchTerm.startsWith('@')
                      ? debouncedSearchTerm.substring(1)
                      : debouncedSearchTerm
                  }`}
                >
                  Go to @
                  {debouncedSearchTerm.startsWith('@')
                    ? debouncedSearchTerm.substring(1)
                    : debouncedSearchTerm}
                </Link>
              </div>
            )}
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <div className="h-2 text-center text-primary mt-2 text-sm">
            <button type="button" onClick={() => fetchNextPage()}>
              Show More
            </button>
          </div>
        )}
        {isFetchingNextPage && (
          <div className="h-2 text-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
