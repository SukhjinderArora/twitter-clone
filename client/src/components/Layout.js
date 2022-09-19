import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import BottomNav from './Navigation/BottomNav';
import SideNav from './Navigation/SideNav';
import SideDrawer from './Navigation/SideDrawer';

const Layout = () => {
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpenSideDrawer(false);
  }, [location.pathname]);

  return (
    <div className="h-[100vh] relative flex overflow-y-auto">
      <div className="sm:hidden">
        <SideDrawer
          isOpen={openSideDrawer}
          direction="left"
          onDismiss={() => setOpenSideDrawer(false)}
        >
          <SideNav />
        </SideDrawer>
      </div>
      <div className="hidden sm:block sm:w-auto lg:w-64 sticky top-0">
        <SideNav />
      </div>
      <div className="flex-1 min-w-0">
        <Outlet context={[openSideDrawer, setOpenSideDrawer]} />
      </div>
      <Toaster
        position="bottom-center"
        containerStyle={{
          marginBottom: '3.5rem',
          inset: '0',
        }}
        toastOptions={{
          duration: 2000,
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
