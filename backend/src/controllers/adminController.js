const bcrypt = require('bcryptjs');
const db = require('../config/db');
const HttpError = require('../utils/httpError');
const { orderBy, like } = require('../utils/listQuery');

exports.stats = async (req, res) => {
  const [[totals]] = await db.query(
    `SELECT (SELECT COUNT(*) FROM users)   AS totalUsers,
            (SELECT COUNT(*) FROM stores)  AS totalStores,
            (SELECT COUNT(*) FROM ratings) AS totalRatings,
            (SELECT ROUND(AVG(rating), 1) FROM ratings) AS averageRating`
  );

  const [counts] = await db.query('SELECT rating, COUNT(*) AS total FROM ratings GROUP BY rating');
  const distribution = [1, 2, 3, 4, 5].map((n) => Number(counts.find((c) => c.rating === n)?.total || 0));

  const [topStores] = await db.query(
    `SELECT s.id, s.name, ROUND(AVG(r.rating), 1) AS avgRating, COUNT(r.id) AS ratingCount
       FROM stores s JOIN ratings r ON r.store_id = s.id
      GROUP BY s.id
      ORDER BY avgRating DESC, ratingCount DESC
      LIMIT 5`
  );

  const [recent] = await db.query(
    `SELECT r.id, u.name AS userName, s.name AS storeName, r.rating, r.updated_at AS updatedAt
       FROM ratings r
       JOIN users u  ON u.id = r.user_id
       JOIN stores s ON s.id = r.store_id
      ORDER BY r.updated_at DESC
      LIMIT 5`
  );

  res.json({
    ...totals,
    averageRating: totals.averageRating === null ? null : Number(totals.averageRating),
    distribution,
    topStores: topStores.map((s) => ({ ...s, avgRating: Number(s.avgRating) })),
    recent,
  });
};

exports.createUser = async (req, res) => {
  const { name, email, address, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query('INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)', [name, email, hash, address, role]);
  res.status(201).json({ id: result.insertId, message: 'User created' });
};

const USER_SORT = { name: 'name', email: 'email', address: 'address', role: 'role' };

exports.listUsers = async (req, res) => {
  const { name, email, address, role, sortBy, order } = req.query;
  const where = ['name LIKE ?', 'email LIKE ?', 'address LIKE ?'];
  const params = [like(name), like(email), like(address)];
  if (['admin', 'user', 'owner'].includes(role)) {
    where.push('role = ?');
    params.push(role);
  }
  const [rows] = await db.query(
    `SELECT id, name, email, address, role FROM users WHERE ${where.join(' AND ')} ${orderBy(sortBy, order, USER_SORT, 'name')}`,
    params
  );
  res.json(rows);
};

exports.getUser = async (req, res) => {
  const [[user]] = await db.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [req.params.id]);
  if (!user) throw new HttpError(404, 'User not found');
  if (user.role === 'owner') {
    const [[row]] = await db.query(
      `SELECT ROUND(AVG(r.rating), 1) AS rating
         FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
        WHERE s.owner_id = ?`,
      [user.id]
    );
    user.rating = row.rating === null ? null : Number(row.rating);
  }
  res.json(user);
};

exports.listOwners = async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email
       FROM users u LEFT JOIN stores s ON s.owner_id = u.id
      WHERE u.role = 'owner' AND s.id IS NULL
      ORDER BY u.name`
  );
  res.json(rows);
};

exports.createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const [[owner]] = await db.query("SELECT id FROM users WHERE id = ? AND role = 'owner'", [ownerId]);
  if (!owner) throw new HttpError(400, 'Selected user is not a store owner');
  const [result] = await db.query('INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)', [name, email, address, ownerId]);
  res.status(201).json({ id: result.insertId, message: 'Store created' });
};

const STORE_SORT = { name: 's.name', email: 's.email', address: 's.address', rating: 'rating' };

exports.listStores = async (req, res) => {
  const { name, email, address, sortBy, order } = req.query;
  const [rows] = await db.query(
    `SELECT s.id, s.name, s.email, s.address, ROUND(AVG(r.rating), 1) AS rating
       FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
      GROUP BY s.id
      ${orderBy(sortBy, order, STORE_SORT, 'name')}`,
    [like(name), like(email), like(address)]
  );
  res.json(rows.map((r) => ({ ...r, rating: r.rating === null ? null : Number(r.rating) })));
};
