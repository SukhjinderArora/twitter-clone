import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

import Layout from './components/Layout';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </div>
  );
};

export default App;
