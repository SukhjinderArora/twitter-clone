import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import BottomNav from './mobile/BottomNav';

const Layout = () => {
  return (
    <div className="h-[100vh] relative">
      <Outlet />
      <Toaster
        position="bottom-center"
        containerStyle={{
          marginBottom: '3.5rem',
          inset: '0',
        }}
      />
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
