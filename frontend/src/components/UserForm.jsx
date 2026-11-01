import { useState } from 'react';
import Field from './Field';
import { validate } from '../validation';
import { errMsg } from '../api';
import { ROLE_LABELS } from '../constants';

const EMPTY = { name: '', email: '', address: '', password: '', role: 'user' };

// Shared by public signup and the admin "Add user" form.
export default function UserForm({ showRole = false, submitLabel, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(values, ['name', 'email', 'address', 'password']);
    setErrors(errs);
    setServerError('');
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await onSubmit({ ...values, name: values.name.trim(), email: values.email.trim(), address: values.address.trim() });
      setValues(EMPTY);
    } catch (err) {
      setServerError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="form">
      <Field label="Name (20-60 characters)" error={errors.name}>
        <input value={values.name} onChange={set('name')} maxLength={60} autoComplete="name" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" value={values.email} onChange={set('email')} autoComplete="email" />
      </Field>
      <Field label="Address (max 400 characters)" error={errors.address}>
        <textarea rows={3} value={values.address} onChange={set('address')} />
      </Field>
      <Field label="Password (8-16 characters, one uppercase, one special)" error={errors.password}>
        <input type="password" value={values.password} onChange={set('password')} autoComplete="new-password" />
      </Field>
      {showRole && (
        <Field label="Role">
          <select value={values.role} onChange={set('role')}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
      )}
      {serverError && <p className="alert alert-error" role="alert">{serverError}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
    </form>
  );
}
