import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../shared/components/layout/Navbar.jsx';
import { Sidebar } from '../../shared/components/layout/Sidebar.jsx';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="admin-shell__workspace">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="admin-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
