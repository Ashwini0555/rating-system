import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api';
import { useAuth } from '../../AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const average = stats && stats.totalStores ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0.0';

  const cards = [
    { label: 'Total users', value: stats?.totalUsers, tone: 'blue', to: '/admin/users' },
    { label: 'Total stores', value: stats?.totalStores, tone: 'teal', to: '/admin/stores' },
    { label: 'Ratings submitted', value: stats?.totalRatings, tone: 'amber' },
    { label: 'Ratings per store', value: stats ? average : undefined, tone: 'rose' },
  ];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <section className="hero">
        <div>
          <p className="hero-date">{today}</p>
          <h1>Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="muted">A quick look at what is happening on the platform.</p>
        </div>
        <div className="hero-actions">
          <Link className="btn" to="/admin/users">Manage users</Link>
          <Link className="btn btn-ghost" to="/admin/stores">Manage stores</Link>
        </div>
      </section>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="stat-grid">
        {cards.map((c) => (
          <div className={`card stat-card tone-${c.tone}`} key={c.label}>
            <span className="stat-label">{c.label}</span>
            <strong className="stat-value">{c.value ?? '–'}</strong>
            {c.to ? <Link to={c.to} className="stat-link">View all</Link> : <span className="stat-link-space" />}
          </div>
        ))}
      </div>
    </>
  );
}