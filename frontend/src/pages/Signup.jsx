import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthLayout from '../components/AuthLayout';
import UserForm from '../components/UserForm';

export default function Signup() {
  const navigate = useNavigate();
  const register = async ({ name, email, address, password }) => {
    await api.post('/auth/signup', { name, email, address, password });
    navigate('/login', { state: { message: 'Account created. Log in to continue.' } });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start rating stores."
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <UserForm submitLabel="Sign up" onSubmit={register} />
    </AuthLayout>
  );
}