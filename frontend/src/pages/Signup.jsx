import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import UserForm from '../components/UserForm';

export default function Signup() {
  const navigate = useNavigate();
  const register = async ({ name, email, address, password }) => {
    await api.post('/auth/signup', { name, email, address, password });
    navigate('/login', { state: { message: 'Account created. Log in to continue.' } });
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Create an account</h1>
        <UserForm submitLabel="Sign up" onSubmit={register} />
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
