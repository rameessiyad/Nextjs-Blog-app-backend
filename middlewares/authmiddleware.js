const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const asyncHandler = require('express-async-handler');

const isAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else {
        res.status(401);
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the decoded token
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

const adminOnly = asyncHandler(async (req, res, next) => {
    // Check if user is admin
    if (req.user && req.user.isAdmin) {
        console.log("Admin access granted to user:", req.user._id); 
        next();
    } else {
        console.log("Admin access denied for user:", req.user ? req.user._id : 'No user');
        res.status(401);
        throw new Error('Not Authorized as an admin');
    }
});

module.exports = { isAuth, adminOnly };