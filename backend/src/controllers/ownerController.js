const db = require('../config/db');
const HttpError = require('../utils/httpError');
const { orderBy } = require('../utils/listQuery');

const SORT = { name: 'u.name', email: 'u.email', rating: 'r.rating', updatedAt: 'r.updated_at' };

exports.dashboard = async (req, res) => {
  const [[store]] = await db.query('SELECT id, name, address FROM stores WHERE owner_id = ?', [req.user.id]);
  if (!store) throw new HttpError(404, 'No store is assigned to your account yet');

  const [[summary]] = await db.query('SELECT ROUND(AVG(rating), 1) AS averageRating, COUNT(*) AS totalRatings FROM ratings WHERE store_id = ?', [store.id]);
  const { sortBy, order } = req.query;
  const [raters] = await db.query(
    `SELECT u.id, u.name, u.email, r.rating, r.updated_at AS updatedAt
       FROM ratings r JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
      ${orderBy(sortBy, order, SORT, 'name')}`,
    [store.id]
  );
  res.json({
    store,
    averageRating: summary.averageRating === null ? null : Number(summary.averageRating),
    totalRatings: summary.totalRatings,
    raters,
  });
};
