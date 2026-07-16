import { Outlet } from 'react-router-dom';
import AdminNav from '../components/AdminNav';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-brand-gray-light">
      <AdminNav />
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-5">
        <Outlet />
      </main>
    </div>
  );
}
