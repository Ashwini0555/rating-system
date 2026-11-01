const jwt = require('jsonwebtoken');
const HttpError = require('../utils/httpError');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(new HttpError(401, 'Authentication required'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new HttpError(403, 'You do not have access to this resource'));

module.exports = { authenticate, authorize };
