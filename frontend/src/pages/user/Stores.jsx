import { useState } from 'react';
import api, { errMsg } from '../../api';
import { useList } from '../../hooks';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StarRating from '../../components/StarRating';

const FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
];

// Pick 1-5 stars, then submit (first time) or update (already rated).
function RateCell({ store, onSaved }) {
  const [pick, setPick] = useState(store.myRating || 0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const changed = pick && pick !== store.myRating;

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await api.put(`/stores/${store.id}/rating`, { rating: pick });
      onSaved();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rate-cell">
      <StarRating value={pick} onChange={setPick} />
      <button className="btn btn-small" onClick={save} disabled={!changed || busy}>
        {store.myRating ? 'Update rating' : 'Submit rating'}
      </button>
      {error && <small className="error">{error}</small>}
    </div>
  );
}

export default function Stores() {
  const list = useList('/stores', 'name');

  const columns = [
    { key: 'name', label: 'Store name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'overallRating', label: 'Overall rating', sortable: true, render: (s) => <StarRating value={s.overallRating} showNumber /> },
    { key: 'myRating', label: 'Your rating', sortable: true, render: (s) => (s.myRating ? <StarRating value={s.myRating} /> : <span className="muted">Not rated</span>) },
    { key: 'action', label: 'Rate this store', render: (s) => <RateCell key={`${s.id}-${s.myRating}`} store={s} onSaved={list.reload} /> },
  ];

  return (
    <>
      <h1>Stores</h1>
      <FilterBar fields={FIELDS} filters={list.filters} setFilter={list.setFilter} />
      {list.error && <p className="alert alert-error">{list.error}</p>}
      <DataTable columns={columns} rows={list.data || []} sort={list.sort} onSort={list.onSort} loading={list.loading} emptyText="No stores match your search." />
    </>
  );
}
