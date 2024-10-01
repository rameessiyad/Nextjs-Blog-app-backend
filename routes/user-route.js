const express = require('express');
const { registerUser, login, getBlockedUsers, blockUser, getAllUsers, getUsersCount, logout } = require('../controllers/user-controller');
const { isAuth, adminOnly } = require('../middlewares/authmiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', logout);

//admin only
router.post('/block/:id', isAuth, adminOnly, blockUser);
router.get('/blocked-users', isAuth, adminOnly, getBlockedUsers);
router.get('/users-count', isAuth, adminOnly, getUsersCount);
router.post('/all-users', isAuth, adminOnly, getAllUsers);

module.exports = router;