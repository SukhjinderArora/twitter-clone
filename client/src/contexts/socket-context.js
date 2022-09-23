import * as React from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

import { useAuth } from './auth-context';

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = React.useState(null);
  const { isAuthenticated, token } = useAuth();

  React.useEffect(() => {
    let socketIO = null;
    if (isAuthenticated) {
      socketIO = io(
        process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '',
        {
          withCredentials: true,
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSocket(socketIO);
    }
    return () => {
      if (socketIO) {
        socketIO.disconnect();
        socketIO.off();
        setSocket(null);
      }
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

SocketProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { SocketProvider, useSocket };
