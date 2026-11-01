const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const HttpError = require('../utils/httpError');

exports.signup = async (req, res) => {
  const { name, email, address, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)', [name, email, hash, address, 'user']);
  res.status(201).json({ message: 'Account created. You can now log in.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [[user]] = await db.query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [email]);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const [[user]] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
    throw new HttpError(400, 'Current password is incorrect');
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
  res.json({ message: 'Password updated' });
};
