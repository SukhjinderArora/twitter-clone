import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Fab from '../components/Fab';
import Header from '../components/mobile/Header';
import PostsList from '../components/Posts/PostsList';

import usePageTitle from '../hooks/usePageTitle';
import useScrollToTop from '../hooks/useScrollToTop';

const Home = () => {
  useScrollToTop();
  const { setPageTitle } = usePageTitle('Home / Kookoo');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div
      className={`bg-background relative ${
        modalOpen ? 'pointer-events-none' : ''
      }`}
    >
      <div className="fixed top-0 left-0 w-full">
        <Header />
      </div>
      <div className="mt-14">
        <PostsList />
      </div>
      <div className="fixed right-5 bottom-20 z-50">
        <Fab label="new post" onClick={openModal} />
      </div>
    </div>
  );
};

export default Home;
