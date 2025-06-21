const express = require('express');
const userRoutes = require('./user/user_router');
const postRoutes = require('./post/post_router');
const commentRoutes = require('./comment/comment_routers');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/comment', commentRoutes);

module.exports = router;