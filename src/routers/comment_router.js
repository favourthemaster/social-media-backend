const express = require('express');
const authUser = require('../middleware/auth_user');
const Comment = require('../models/comment');

const router = express.Router();

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request
 */

router.post('/comment', authUser,  async (req, res) => {
    try {
        const comment = new Comment({
            ...req.body,
            userId: req.user._id
        });
        await comment.save();
        res.status(201).send(comment);
    } catch (error) {;
        res.status(400).send(error.message)
    }
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       500:
 *         description: Server error
 */

router.get('/comments/:id', authUser, async (req, res) => {
    try {
        const _id = req.params.id;
        const comments = await Comment.find({postId: _id});
        if(!comments){
            res.status(200).send("This Post has no comments");
        }
        res.send(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});








module.exports = router;
