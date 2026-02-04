import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-4 pb-20 md:pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
