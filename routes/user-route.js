const express = require('express');
const { registerUser, login, getBlockedUsers, blockUser, getAllUsers } = require('../controllers/user-controller');
const { isAuth, adminOnly } = require('../middlewares/authmiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);

//admin only
router.post('/block/:id', isAuth, adminOnly, blockUser);
router.get('/blocked-users', isAuth, adminOnly, getBlockedUsers);
router.post('/all-users', isAuth, adminOnly, getAllUsers);

module.exports = router;