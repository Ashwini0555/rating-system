import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ROLE_LABELS } from '../constants';
import Icon from './Icon';

const LINKS = {
  admin: [['/admin', 'Dashboard', 'dashboard'], ['/admin/users', 'Users', 'users'], ['/admin/stores', 'Stores', 'store']],
  user: [['/stores', 'Stores', 'store']],
  owner: [['/owner', 'My store', 'star']],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <span className="logo-mark">★</span>
        Rating System
      </div>

      <nav>
        {(LINKS[user.role] || []).map(([to, label, icon]) => (
          <NavLink key={to} to={to} end className="side-link">
            <Icon name={icon} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <NavLink to="/password" className="side-link">
          <Icon name="lock" /> Change password
        </NavLink>
        <button className="side-link" onClick={handleLogout}>
          <Icon name="logout" /> Log out
        </button>
        <div className="side-user">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{ROLE_LABELS[user.role]}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}