const express = require('express');
const authUser = require('../../middleware/auth_user');
const handlers = require('./comment_handlers');
const validate= require('../../middleware/validate');
const validator = require('./comment_validator');

const router = express.Router();

router.post('/create',authUser, validate(validator.createComment), handlers.createCommentHandler);

router.get('/get/:postId', authUser, validate(validator.getCommentsByPost),handlers.getCommentsByPostHandler);

router.delete('/delete/:commentId', authUser, validate(validator.deleteComment), handlers.deleteCommentHandler);

module.exports = router; 