const { body } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const name = body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Name must be 20 to 60 characters');
const email = body('email').trim().isEmail().withMessage('Enter a valid email').isLength({ max: 100 }).withMessage('Email is too long').toLowerCase();
const address = body('address').trim().isLength({ min: 1, max: 400 }).withMessage('Address is required (max 400 characters)');
const passwordField = (field) =>
  body(field)
    .matches(PASSWORD_REGEX)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character');

exports.signupRules = [name, email, address, passwordField('password')];
exports.loginRules = [email, body('password').notEmpty().withMessage('Password is required')];
exports.changePasswordRules = [body('currentPassword').notEmpty().withMessage('Current password is required'), passwordField('newPassword')];
exports.createUserRules = [name, email, address, passwordField('password'), body('role').isIn(['admin', 'user', 'owner']).withMessage('Invalid role')];
exports.createStoreRules = [name, email, address, body('ownerId').isInt({ min: 1 }).withMessage('Select a store owner').toInt()];
exports.ratingRules = [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5').toInt()];
