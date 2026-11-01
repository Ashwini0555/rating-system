const DUPLICATE_MESSAGES = {
  uq_users_email: 'A user with this email already exists',
  uq_stores_email: 'A store with this email already exists',
  uq_stores_owner: 'This owner already has a store',
};


module.exports = (err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') {
    const key = Object.keys(DUPLICATE_MESSAGES).find((k) => (err.sqlMessage || '').includes(k));
    return res.status(409).json({ message: DUPLICATE_MESSAGES[key] || 'Duplicate entry' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Internal server error' : err.message });
};
