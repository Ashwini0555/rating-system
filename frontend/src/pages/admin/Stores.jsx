import { useEffect, useState } from 'react';
import api, { errMsg } from '../../api';
import { useList } from '../../hooks';
import { validate } from '../../validation';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import Field from '../../components/Field';
import StarRating from '../../components/StarRating';

const FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
];

const EMPTY = { name: '', email: '', address: '', ownerId: '' };

function AddStoreForm({ onCreated }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [owners, setOwners] = useState([]);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.get('/admin/owners').then((r) => setOwners(r.data)).catch((e) => setServerError(errMsg(e)));
  }, []);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate(values, ['name', 'email', 'address']);
    if (!values.ownerId) errs.ownerId = 'Select a store owner';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await api.post('/admin/stores', {
        name: values.name.trim(), email: values.email.trim(), address: values.address.trim(), ownerId: Number(values.ownerId),
      });
      onCreated();
    } catch (err) {
      setServerError(errMsg(err));
    }
  };

  return (
    <form onSubmit={submit} noValidate className="form card narrow">
      <Field label="Store name (20-60 characters)" error={errors.name}>
        <input value={values.name} onChange={set('name')} />
      </Field>
      <Field label="Store email" error={errors.email}>
        <input type="email" value={values.email} onChange={set('email')} />
      </Field>
      <Field label="Address (max 400 characters)" error={errors.address}>
        <textarea rows={3} value={values.address} onChange={set('address')} />
      </Field>
      <Field label="Store owner" error={errors.ownerId}>
        <select value={values.ownerId} onChange={set('ownerId')}>
          <option value="">Select an owner</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
          ))}
        </select>
        {!owners.length && <small className="muted">No unassigned store owners. Add a user with the Store Owner role first.</small>}
      </Field>
      {serverError && <p className="alert alert-error" role="alert">{serverError}</p>}
      <button className="btn">Create store</button>
    </form>
  );
}

export default function Stores() {
  const list = useList('/admin/stores', 'name');
  const [adding, setAdding] = useState(false);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: (s) => <StarRating value={s.rating} showNumber /> },
  ];

  return (
    <>
      <div className="page-head">
        <h1>Stores</h1>
        <button className="btn" onClick={() => setAdding((a) => !a)}>{adding ? 'Cancel' : 'Add store'}</button>
      </div>
      {adding && <AddStoreForm onCreated={() => { setAdding(false); list.reload(); }} />}
      <FilterBar fields={FIELDS} filters={list.filters} setFilter={list.setFilter} />
      {list.error && <p className="alert alert-error">{list.error}</p>}
      <DataTable columns={columns} rows={list.data || []} sort={list.sort} onSort={list.onSort} loading={list.loading} emptyText="No stores match these filters." />
    </>
  );
}
