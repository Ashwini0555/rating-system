import { useState } from 'react';
import api, { errMsg } from '../api';
import { validate } from '../validation';
import Field from '../components/Field';

export default function ChangePassword() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    const errs = validate({ password: values.newPassword }, ['password']);
    if (!values.currentPassword) errs.currentPassword = 'Enter your current password';
    setErrors(errs.password ? { ...errs, newPassword: errs.password } : errs);
    if (Object.keys(errs).length) return;
    try {
      await api.put('/auth/password', values);
      setValues({ currentPassword: '', newPassword: '' });
      setStatus({ type: 'ok', text: 'Password updated.' });
    } catch (err) {
      setStatus({ type: 'error', text: errMsg(err) });
    }
  };

  return (
    <div className="card narrow">
      <h1>Change password</h1>
      <form onSubmit={submit} noValidate className="form">
        <Field label="Current password" error={errors.currentPassword}>
          <input type="password" value={values.currentPassword} onChange={(e) => setValues({ ...values, currentPassword: e.target.value })} autoComplete="current-password" />
        </Field>
        <Field label="New password (8-16 characters, one uppercase, one special)" error={errors.newPassword}>
          <input type="password" value={values.newPassword} onChange={(e) => setValues({ ...values, newPassword: e.target.value })} autoComplete="new-password" />
        </Field>
        {status.text && <p className={`alert alert-${status.type}`} role="status">{status.text}</p>}
        <button className="btn">Update password</button>
      </form>
    </div>
  );
}
