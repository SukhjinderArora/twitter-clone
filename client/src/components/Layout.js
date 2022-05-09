import { Outlet } from 'react-router-dom';

import BottomNav from './mobile/BottomNav';

const Layout = () => {
  return (
    <div className="h-[100vh] relative">
      <Outlet />
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
