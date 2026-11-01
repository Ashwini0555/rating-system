import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useList } from '../../hooks';
import { ROLE_LABELS } from '../../constants';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import UserForm from '../../components/UserForm';

const FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'role', label: 'Role', options: Object.entries(ROLE_LABELS) },
];

export default function Users() {
  const list = useList('/admin/users', 'name');
  const [adding, setAdding] = useState(false);

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (u) => <Link to={`/admin/users/${u.id}`}>{u.name}</Link> },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (u) => ROLE_LABELS[u.role] },
  ];

  const addUser = async (values) => {
    await api.post('/admin/users', values);
    setAdding(false);
    list.reload();
  };

  return (
    <>
      <div className="page-head">
        <h1>Users</h1>
        <button className="btn" onClick={() => setAdding((a) => !a)}>{adding ? 'Cancel' : 'Add user'}</button>
      </div>
      {adding && (
        <div className="card narrow">
          <UserForm showRole submitLabel="Create user" onSubmit={addUser} />
        </div>
      )}
      <FilterBar fields={FIELDS} filters={list.filters} setFilter={list.setFilter} />
      {list.error && <p className="alert alert-error">{list.error}</p>}
      <DataTable columns={columns} rows={list.data || []} sort={list.sort} onSort={list.onSort} loading={list.loading} emptyText="No users match these filters." />
    </>
  );
}
