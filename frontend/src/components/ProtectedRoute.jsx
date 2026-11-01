import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { homePath } from '../constants';

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homePath(user.role)} replace />;
  return children;
}
