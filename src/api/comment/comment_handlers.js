const httpStatus = require('http-status');
const ApiError = require('../../utils/api_error');
const response = require('../../utils/response');
const logger = require('../../config/logger');
const {getPostById, updatePost} = require('../post/post_services');
const services = require('./comment_services');
const ErrorCodes = require('../../utils/error_codes');

async function createCommentHandler(req, res, next) {
    try {
        const userId = req.user;

        const { postId, comment } = req.body;
        const post = await getPostById(postId);
        if(!post){
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'The Post could not be found'})
        }

        const newComment = await services.createComment({ postId, comment, userId });

        await updatePost({postId, newComment});

        res.status(201).send(response({success: true,  data: { comment } }));
    } catch (error) {
        next(error);
    }
}


async function getCommentsByPostHandler(req, res, next) {
    try {
        const {postId} = req.params;
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const comments = await services.getCommentsByPost({postId, limit, skip});
        res.send(response({success: true, data: { comments } }));
    } catch (error) {
        next(error);
    }
}

async function deleteCommentHandler(req, res, next) {
    try {
        const { commentId } = req.params;
        const comment = await services.deleteComment({commentId});
        if (!comment) {
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND,code: ErrorCodes.NOT_FOUND, message: 'Comment not found'});
        }
        res.status(204).send(response({success: true, data: comment}));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCommentHandler,
    getCommentsByPostHandler,
    deleteCommentHandler
};
