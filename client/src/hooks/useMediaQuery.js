import { useState, useEffect } from 'react';

const getMatches = (query) => {
  // Check to see if the hook is running inside a browser or is server-side rendered
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return false;
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(getMatches(query));

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const onChange = (evt) => {
      setMatches(evt.matches);
    };

    if (mediaQueryList.addListener) {
      mediaQueryList.addListener(onChange);
    } else {
      mediaQueryList.addEventListener('change', onChange);
    }

    return () => {
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(onChange);
      } else {
        mediaQueryList.removeEventListener('change', onChange);
      }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
