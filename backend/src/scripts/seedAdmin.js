require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

(async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const [[existing]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    console.log(`Admin ${email} already exists.`);
  } else {
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)', [
      'System Administrator', email, hash, 'Head Office', 'admin',
    ]);
    console.log(`Admin created: ${email}`);
  }
  await db.end();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
