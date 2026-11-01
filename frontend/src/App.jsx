import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { homePath } from './constants';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import UserDetail from './pages/admin/UserDetail';
import AdminStores from './pages/admin/Stores';
import UserStores from './pages/user/Stores';
import OwnerDashboard from './pages/owner/Dashboard';

function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homePath(user.role)} replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={homePath(user.role)} replace /> : <Signup />} />

      <Route element={<Layout />}>
        <Route path="/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute roles={['admin']}><UserDetail /></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><AdminStores /></ProtectedRoute>} />

        <Route path="/stores" element={<ProtectedRoute roles={['user']}><UserStores /></ProtectedRoute>} />
        <Route path="/owner" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to={user ? homePath(user.role) : '/login'} replace />} />
    </Routes>
  );
}
