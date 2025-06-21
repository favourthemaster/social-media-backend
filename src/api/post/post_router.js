const express = require('express');
const authUser = require('../../middleware/auth_user');
const handlers = require('./post_handlers');
const {uploadPost} = require('../../middleware/multer_upload');
const validate = require('../../middleware/validate');
const validator = require('./post_validator');

const router = express.Router();

/**
 * @swagger
 * /createPost:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /getPosts:
 *   get:
 *     summary: Retrieve posts with pagination
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       400:
 *         description: Bad request
 */

router.post('/createPost', authUser, uploadPost, validate(validator.createPost), handlers.createPostHandler);

router.get('/getPosts', authUser, validate(validator.getPostsWithPagination), handlers.getPostsHandler);

router.post('/like', authUser, validate(validator.likePost), handlers.likePostHandler);

router.post('/unlike', authUser, validate(validator.unlikePost), handlers.unlikePostHandler);

module.exports = router;