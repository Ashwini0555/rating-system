import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const LINKS = {
  admin: [['/admin', 'Dashboard'], ['/admin/users', 'Users'], ['/admin/stores', 'Stores']],
  user: [['/stores', 'Stores']],
  owner: [['/owner', 'My store']],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <span className="brand">Rating System</span>
      <nav>
        {(LINKS[user.role] || []).map(([to, label]) => (
          <NavLink key={to} to={to} end>{label}</NavLink>
        ))}
        <NavLink to="/password">Change password</NavLink>
      </nav>
      <div className="nav-user">
        <span>{user.name}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}
