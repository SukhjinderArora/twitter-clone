import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
  matchPath,
} from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import axios from 'axios';

import { useAuth } from './contexts/auth-context';
import { useSocket } from './contexts/socket-context';
import useScrollToTop from './hooks/useScrollToTop';

import { STATUS } from './utils/utils';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import SignupSuccess from './pages/SignupSuccess';
import UserProfile from './pages/UserProfile';
import Follow from './pages/Follow';
import NoMatch from './pages/NoMatch';
import PostDetail from './pages/PostDetail';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Explore from './pages/Explore';

import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import ComposePost from './components/Posts/ComposePost';
import UserPosts from './components/Posts/UserPosts';
import PostsAndReplies from './components/Posts/PostsAndReplies';
import LikedPosts from './components/Posts/LikedPosts';
import FolloweesList from './components/FolloweesList';
import FollowersList from './components/FollowersList';

import useMediaQuery from './hooks/useMediaQuery';
import ChatHeader from './components/mobile/ChatHeader';

const App = () => {
  const { login, isAuthenticated, expiresAt, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const isWidthGreaterThan640 = useMediaQuery('(min-width: 640px)');
  const { state } = location;

  useScrollToTop();

  const verifyToken = useMutation(
    () => {
      return axios.post(
        '/api/auth/verify-token',
        {},
        {
          withCredentials: true,
        }
      );
    },
    {
      onSuccess: (response) => {
        // eslint-disable-next-line no-shadow
        const { user, accessToken: token, expiresAt } = response.data;
        if (response.status === 204) {
          logout();
        } else {
          login(user, token, expiresAt);
        }
      },
      onError: () => {
        logout();
      },
    }
  );

  useEffect(() => {
    verifyToken.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    login,
    // exclude mutations - because verifyToken is an unstable refrence and linter prevents listing only mutation function
  ]);

  useEffect(() => {
    let verifyTokenTimer;
    if (isAuthenticated) {
      verifyTokenTimer = setTimeout(() => {
        verifyToken.mutate();
      }, new Date(expiresAt).getTime() - Date.now() - 10 * 1000);
    }
    return () => {
      if (isAuthenticated && verifyTokenTimer) {
        clearTimeout(verifyTokenTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    expiresAt,
    // exclude mutations - because verifyToken is an unstable refrence and linter prevents listing only mutation function
  ]);

  useEffect(() => {
    if (socket) {
      socket.on('new notification', () => {
        queryClient.invalidateQueries('notifications');
      });
      socket.on('new message', ({ chatId }) => {
        queryClient.invalidateQueries(['chat', chatId]);
        queryClient.invalidateQueries('messages');
      });
    }
  }, [socket, queryClient]);

  return (
    <div>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <RequireAuth redirectTo="/signup">
                <Navigate to="home" />
              </RequireAuth>
            }
          />
          <Route
            path="home"
            element={
              <RequireAuth redirectTo="/signup">
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="explore"
            element={
              <RequireAuth redirectTo="/signup">
                <Explore />
              </RequireAuth>
            }
          />
          <Route
            path="notifications"
            element={
              <RequireAuth redirectTo="/signup">
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="messages"
            element={
              <RequireAuth redirectTo="/signup">
                <Messages />
              </RequireAuth>
            }
          >
            {isWidthGreaterThan640 && (
              <Route
                path=":chatId"
                element={<Chat key={location.pathname} />}
              />
            )}
          </Route>
          <Route path="/:username" element={<UserProfile />}>
            <Route index element={<UserPosts />} />
            <Route path="posts" element={<UserPosts />} />
            <Route path="with_replies" element={<PostsAndReplies />} />
            <Route path="likes" element={<LikedPosts />} />
          </Route>
          <Route
            path="/:username/post/:postId"
            element={<PostDetail key={location.pathname} />}
          />
          <Route
            path="/:username/list"
            element={
              <RequireAuth redirectTo="/signup">
                <Follow />
              </RequireAuth>
            }
          >
            <Route path="followers" element={<FollowersList />} />
            <Route path="following" element={<FolloweesList />} />
          </Route>
          <Route
            path="compose/post"
            element={
              <RequireAuth redirectTo="/signup">
                <Navigate
                  to="/home"
                  state={{
                    from: location,
                  }}
                />
              </RequireAuth>
            }
          />
        </Route>
        <Route
          path="/signup"
          element={
            <RedirectIfLoggedIn redirectTo="/">
              <Signup />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectIfLoggedIn redirectTo="/">
              <Signin />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/signup/success"
          element={
            <RequireAuth redirectTo="/signup">
              <SignupSuccess />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      {state?.backgroundLocation &&
        matchPath('/compose/post', location.pathname) && (
          <Routes>
            <Route
              path="/compose/post"
              element={
                <RequireAuth redirectTo="/signup">
                  <Modal
                    isOpen
                    onDismiss={() =>
                      navigate('/home', {
                        replace: true,
                      })
                    }
                    title="Add new post"
                  >
                    <ComposePost />
                  </Modal>
                </RequireAuth>
              }
            />
          </Routes>
        )}
      {!isWidthGreaterThan640 &&
        matchPath('/messages/:chatId', location.pathname) && (
          <Routes>
            <Route
              path="/messages/:chatId"
              element={
                <RequireAuth redirectTo="/signup">
                  <Modal
                    isOpen
                    onDismiss={() => navigate(-1)}
                    customHeader={<ChatHeader onClose={() => navigate(-1)} />}
                  >
                    <Chat key={location.pathname} />
                  </Modal>
                </RequireAuth>
              }
            />
          </Routes>
        )}
    </div>
  );
};

const RequireAuth = ({ children, redirectTo }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === STATUS.PENDING) return <SplashScreen />;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} />
  );
};

const RedirectIfLoggedIn = ({ children, redirectTo }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === STATUS.PENDING) return <SplashScreen />;

  return isAuthenticated ? (
    <Navigate to={location.state?.from?.pathname || redirectTo} />
  ) : (
    children
  );
};

RequireAuth.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

RedirectIfLoggedIn.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

export default App;
