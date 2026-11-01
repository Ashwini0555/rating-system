import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../../api';
import { ROLE_LABELS } from '../../constants';
import StarRating from '../../components/StarRating';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`).then((r) => setUser(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  return (
    <>
      <p><Link to="/admin/users">Back to users</Link></p>
      {error && <p className="alert alert-error">{error}</p>}
      {user && (
        <div className="card narrow">
          <h1>{user.name}</h1>
          <dl className="details">
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Address</dt><dd>{user.address}</dd>
            <dt>Role</dt><dd>{ROLE_LABELS[user.role]}</dd>
            {user.role === 'owner' && (
              <>
                <dt>Store rating</dt>
                <dd><StarRating value={user.rating} showNumber /></dd>
              </>
            )}
          </dl>
        </div>
      )}
    </>
  );
}
