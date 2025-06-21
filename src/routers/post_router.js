const express = require('express');
const Post = require('../models/post');
const authUser = require('../middleware/auth_user');
const upload = require('../middleware/multer_upload');
const multer = require('multer'); // Add this line
const ApiError = require('../utils/api_error');
const httpStatus = require('http-status');

const router = express.Router();

/**
 * @swagger
 * /post:
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
router.post('/post', authUser, (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send({ error: 'File size too large. Maximum size is 50MB.' });
            }
            return res.status(400).send({ error: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).send({ error: err.message });
        }

        // Everything went fine.
        next();
    });
}, async (req, res, next) => {
    try {
        const content = req.files.map(file => ({
            url: file.path,
            type: file.mimetype.toString().startsWith('image') ? 'image' : 'video'
        }));

        const postData = JSON.parse(req.body.postData);

        const post = new Post({
            content: content,
            userId: req.user._id,
            ...postData,
        });

        await post.save();
        res.status(201).send(post);
    } catch (e) {
        next(new ApiError(httpStatus.BAD_REQUEST, e.message));
    }
});

router.get('/feed', authUser, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        const posts = await Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalPosts = await Post.countDocuments({});
        res.send({ posts, totalPosts });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;