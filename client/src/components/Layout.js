import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import BottomNav from './Navigation/BottomNav';
import SideNav from './Navigation/SideNav';

const Layout = () => {
  return (
    <div className="h-[100vh] relative sm:flex overflow-y-auto">
      <div className="hidden sm:block w-64 sticky top-0">
        <SideNav />
      </div>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
      <Toaster
        position="bottom-center"
        containerStyle={{
          marginBottom: '3.5rem',
          inset: '0',
        }}
      />
      <div className="sm:hidden">
        <div className="fixed bottom-0 left-0 w-full">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
