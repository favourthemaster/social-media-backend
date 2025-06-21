const express = require('express');
const handlers = require('./user_handlers');
const validator = require('./user_validator');
const validate = require('../../middleware/validate');
const authUser = require('../../middleware/auth_user');
const {uploadProfilePic} = require('../../middleware/multer_upload');

const router = express.Router();

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

router.post('/login', validate(validator.login), handlers.loginHandler);

/**
 * @swagger
 * /registerCredentials:
 *   post:
 *     summary: Register user credentials
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
 *       201:
 *         description: Credentials registered successfully
 *       400:
 *         description: Bad request
 */

router.post('/registerCredentials', validate(validator.createUserCredentials), handlers.createBaseUserHandler);

router.post('/registerInfo', authUser, uploadProfilePic, validate(validator.createUserInfo), handlers.createFinalUserHandler);

router.get('/getUsers', authUser, handlers.getUsersHandler);

router.get('/getUsersByIds', authUser, validate(validator.userByIds), handlers.getUsersByIdsHandler);

router.post('/follow', authUser, validate(validator.followUser), handlers.followUserHandler);

router.post('/unfollow', authUser, validate(validator.unfollowUser), handlers.unfollowUserHandler);

module.exports = router;