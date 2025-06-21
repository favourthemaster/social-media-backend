const express = require('express');
const User = require('../models/user'); 
const authUser = require('../middleware/auth_user');
// const { uploadProfilePic, deleteProfilePic } = require('../middleware/upload_profile_pic');
const ApiError = require('../utils/api_error');
const httpStatus = require('http-status');

const router = express.Router();

/**
 * @swagger
 * /registerStep1:
 *   post:
 *     summary: Register a user (Step 1)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               emailOrPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/registerStep1', async (req, res) => {
    const { username, emailOrPhone } = req.body;
    const user = new User(req.body);

    try {
        const foundUser = await User.findOne({ $or: [{ username }, { emailOrPhone }] });
        if (foundUser) {
            const errorMessage = foundUser.username === user.username
                ? 'Username already exists'
                : foundUser.emailOrPhone.includes('@') ? 'Email already exists' : 'Phone number already exists';
            return res.status(400).send({ error: errorMessage });
        }

        await user.save();
        res.status(201).send({ user, message: 'User created successfully' });
    } catch (e) {
        res.status(400).send(e);
    }
});

// router.post('/registerStep2', uploadProfilePic, async (req, res) => {
//     try {
//         const { userId, fullname, bio } = JSON.parse(req.body.userData);
//         const user = await User.findById(userId);
//         if (!user) {
//             throw new ApiError(httpStatus.NOT_FOUND, "User not found"); // Use ApiError
//         }
//         user.fullname = fullname;
//         user.bio = bio;
//         if (req.file) {
//             user.profilePic = req.file.path;
//         }
//         await user.save();
//         res.send({ user, message: 'User updated successfully' });
//     } catch (e) {
//         if (req.file) {
//             await deleteProfilePic(req.file.filename);
//         }
//         res.status(400).send({error: e.message});
//     }
// });

router.get('/users', authUser, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send({error: e.message});
    }

});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       404:
 *         description: User not found
 */
router.post('/login', async (req, res, next) => {
    const { emailOrPhone, username ,password } = req.body;
    try {
        const user = await User.findByCredentials(emailOrPhone, username ,password);
        if(!user){
            return res.status(404).send({ error: 'User not found' });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        next(e);
    }
});

module.exports = router;