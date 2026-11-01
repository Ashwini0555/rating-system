import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { homePath } from '../constants';
import Field from '../components/Field';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!values.email.trim() || !values.password) return setError('Enter your email and password');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/login', { email: values.email.trim(), password: values.password });
      login(data.token, data.user);
      navigate(homePath(data.user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Log in</h1>
        {state?.message && <p className="alert alert-ok">{state.message}</p>}
        <form onSubmit={submit} noValidate className="form">
          <Field label="Email">
            <input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} autoComplete="email" />
          </Field>
          <Field label="Password">
            <input type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} autoComplete="current-password" />
          </Field>
          {error && <p className="alert alert-error" role="alert">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="muted">New here? <Link to="/signup">Create an account</Link></p>
      </div>
    </div>
  );
}
