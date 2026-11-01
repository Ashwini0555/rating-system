import { useList } from '../../hooks';
import DataTable from '../../components/DataTable';
import StarRating from '../../components/StarRating';

export default function Dashboard() {
  const list = useList('/owner/dashboard', 'name');
  const data = list.data;

  const columns = [
    { key: 'name', label: 'User', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: (r) => <StarRating value={r.rating} /> },
    { key: 'updatedAt', label: 'Date', sortable: true, render: (r) => new Date(r.updatedAt).toLocaleDateString() },
  ];

  return (
    <>
      <h1>{data ? data.store.name : 'My store'}</h1>
      {list.error && <p className="alert alert-error">{list.error}</p>}
      {data && (
        <>
          <div className="stats">
            <div className="card stat">
              <strong><StarRating value={data.averageRating} showNumber /></strong>
              <span>Average rating</span>
            </div>
            <div className="card stat">
              <strong>{data.totalRatings}</strong>
              <span>Ratings received</span>
            </div>
          </div>
          <h2>Users who rated your store</h2>
          <DataTable columns={columns} rows={data.raters} sort={list.sort} onSort={list.onSort} loading={list.loading} emptyText="No one has rated your store yet." />
        </>
      )}
    </>
  );
}
