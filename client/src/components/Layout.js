import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <div>Layout</div>
      <Outlet />
    </div>
  );
};

export default Layout;
