const User = require('../models/user-model');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

module.exports = {
    //register user
    registerUser: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400);
            throw new Error('All fields are requried');
        }

        //check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            success: true,
        });
    }),

    //login
    login: asyncHandler(async (req, res) => {
        const { usernameOrEmail, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
        });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        };

        //check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            generateToken(res, user._id);
            res.status(200).json({
                success: true,
                data: user.isAdmin ? 'admin' : 'user'
            })
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    }),

    //========== ADMIN ONLY CONTROLLERS=================

    //get all users
    getAllUsers: asyncHandler(async (req, res) => {
        const users = await User.find({});
        res.json({ data: users });
    }),

    //block/unblock user
    blockUser: asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        } else {
            user.isBlocked = !user.isBlocked;
            await user.save();

            res.status(200).json({ successMessage: `user is ${user.isBlocked ? 'blocked' : 'unblocked'}` })
        }
    }),

    //get blocked users
    getBlockedUsers: asyncHandler(async (req, res) => {
        const users = await User.find({ isBlocked: true });

        if (!users) {
            res.status(404);
            throw new Error('No blocked users found');
        };

        res.json({ data: users });
    }),

    //get total users count 
    getUsersCount: asyncHandler(async (req, res) => {
        const count = await User.countDocuments();
        res.json({ data: count });
    }),
}