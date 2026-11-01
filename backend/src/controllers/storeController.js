const db = require('../config/db');
const HttpError = require('../utils/httpError');
const { orderBy, like } = require('../utils/listQuery');

const SORT = { name: 's.name', address: 's.address', overallRating: 'overallRating', myRating: 'myRating' };

exports.list = async (req, res) => {
  const { name, address, sortBy, order } = req.query;
  const [rows] = await db.query(
    `SELECT s.id, s.name, s.address,
            ROUND(AVG(r.rating), 1) AS overallRating,
            MAX(CASE WHEN r.user_id = ? THEN r.rating END) AS myRating
       FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.name LIKE ? AND s.address LIKE ?
      GROUP BY s.id
      ${orderBy(sortBy, order, SORT, 'name')}`,
    [req.user.id, like(name), like(address)]
  );
  res.json(rows.map((r) => ({ ...r, overallRating: r.overallRating === null ? null : Number(r.overallRating) })));
};

// Submits a new rating or modifies the user's existing one (one rating per user per store).
exports.rate = async (req, res) => {
  const storeId = Number(req.params.id);
  const [[store]] = await db.query('SELECT id FROM stores WHERE id = ?', [storeId]);
  if (!store) throw new HttpError(404, 'Store not found');
  await db.query(
    'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
    [req.user.id, storeId, req.body.rating]
  );
  res.json({ message: 'Rating saved' });
};
