const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const v = require('../middleware/validators');
const auth = require('../controllers/authController');
const admin = require('../controllers/adminController');
const stores = require('../controllers/storeController');
const owner = require('../controllers/ownerController');

router.post('/auth/signup', v.signupRules, validate, asyncHandler(auth.signup));
router.post('/auth/login', v.loginRules, validate, asyncHandler(auth.login));
router.put('/auth/password', authenticate, v.changePasswordRules, validate, asyncHandler(auth.changePassword));

const adminOnly = [authenticate, authorize('admin')];
router.get('/admin/stats', adminOnly, asyncHandler(admin.stats));
router.get('/admin/users', adminOnly, asyncHandler(admin.listUsers));
router.post('/admin/users', adminOnly, v.createUserRules, validate, asyncHandler(admin.createUser));
router.get('/admin/users/:id', adminOnly, asyncHandler(admin.getUser));
router.get('/admin/owners', adminOnly, asyncHandler(admin.listOwners));
router.get('/admin/stores', adminOnly, asyncHandler(admin.listStores));
router.post('/admin/stores', adminOnly, v.createStoreRules, validate, asyncHandler(admin.createStore));

const userOnly = [authenticate, authorize('user')];
router.get('/stores', userOnly, asyncHandler(stores.list));
router.put('/stores/:id/rating', userOnly, v.ratingRules, validate, asyncHandler(stores.rate));

router.get('/owner/dashboard', authenticate, authorize('owner'), asyncHandler(owner.dashboard));

module.exports = router;
