import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api';
import { useAuth } from '../../AuthContext';
import Icon from '../../components/Icon';
import StarRating from '../../components/StarRating';
import DataTable from '../../components/DataTable';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const distribution = stats?.distribution || [0, 0, 0, 0, 0];
  const max = Math.max(...distribution, 1);

  const cards = [
    { label: 'Total users', value: stats?.totalUsers, icon: 'users', tone: 'violet' },
    { label: 'Total stores', value: stats?.totalStores, icon: 'store', tone: 'blue' },
    { label: 'Ratings submitted', value: stats?.totalRatings, icon: 'star', tone: 'amber' },
    {
      label: 'Average rating',
      value: stats ? (stats.averageRating == null ? '–' : stats.averageRating.toFixed(1)) : undefined,
      icon: 'trending',
      tone: 'green',
    },
  ];

  const columns = [
    { key: 'userName', label: 'User' },
    { key: 'storeName', label: 'Store' },
    { key: 'rating', label: 'Rating', render: (r) => <StarRating value={r.rating} /> },
    { key: 'updatedAt', label: 'Date', render: (r) => new Date(r.updatedAt).toLocaleDateString() },
  ];

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Hi, {user.name.split(' ')[0]}</h1>
          <p className="muted">{today}</p>
        </div>
        <div className="title-actions">
          <Link className="btn" to="/admin/users">Manage users</Link>
          <Link className="btn btn-ghost" to="/admin/stores">Manage stores</Link>
        </div>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="quick-stats">
        {cards.map((c) => (
          <div className={`card qs tone-${c.tone}`} key={c.label}>
            <span className="qs-icon"><Icon name={c.icon} size={22} /></span>
            <div>
              <strong>{c.value ?? '–'}</strong>
              <span>{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="card">
          <div className="panel-head"><h2>Ratings breakdown</h2></div>
          <div className="chart" role="img" aria-label="Number of ratings for each star value">
            {distribution.map((count, i) => (
              <div className="bar-col" key={i}>
                <span className="bar-value">{count}</span>
                <div className="bar-track">
                  <div className={`bar ${count === max && count > 0 ? 'top' : ''}`} style={{ height: `${(count / max) * 100}%` }} />
                </div>
                <span className="bar-label">{i + 1} ★</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="panel-head"><h2>Top rated stores</h2></div>
          {stats?.topStores?.length ? (
            <ol className="top-list">
              {stats.topStores.map((s, i) => (
                <li className="top-item" key={s.id}>
                  <span className="rank">{i + 1}</span>
                  <div className="top-main">
                    <span className="top-name">{s.name}</span>
                    <small className="muted">{s.ratingCount} rating{s.ratingCount === 1 ? '' : 's'}</small>
                  </div>
                  <StarRating value={s.avgRating} showNumber />
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">No ratings yet.</p>
          )}
        </section>
      </div>

      <h2 className="section-title">Latest ratings</h2>
      <DataTable columns={columns} rows={stats?.recent || []} loading={!stats && !error} emptyText="No ratings have been submitted yet." />
    </>
  );
}