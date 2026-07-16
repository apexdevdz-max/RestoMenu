import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Customer pages (unchanged)
import TablePage from './pages/TablePage';
import NotFound from './pages/NotFound';

// Admin pages
import LoginPage from './admin/pages/LoginPage';
import AdminLayout from './admin/layouts/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import OrdersPage from './admin/pages/OrdersPage';
import TablesPage from './admin/pages/TablesPage';
import MenuPage from './admin/pages/MenuPage';
import ClientsPage from './admin/pages/ClientsPage';
import SettingsPage from './admin/pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ==================== CUSTOMER APP (unchanged) ==================== */}
          <Route path="/table/:tableId" element={
            <CartProvider>
              <TablePage />
            </CartProvider>
          } />

          {/* Dev convenience: redirect root to table 1 */}
          <Route path="/" element={<Navigate to="/table/1" replace />} />

          {/* ==================== ADMIN AUTH ==================== */}
          <Route path="/login" element={<LoginPage />} />

          {/* ==================== ADMIN PANEL (protected) ==================== */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ==================== 404 ==================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
