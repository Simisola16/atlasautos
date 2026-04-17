import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
