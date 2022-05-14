import { useEffect, useCallback } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  const setPageTitle = useCallback((pageTitle) => {
    document.title = pageTitle;
  }, []);
  return { setPageTitle };
};

export default usePageTitle;
