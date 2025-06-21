const Joi = require('joi');
const ValidationTypes = require('../../utils/validation_types');

const createComment = {
    body: Joi.object().keys({
        comment: Joi.string().trim().required().messages({
            'any.required': 'You have to provide a comment'
        }),
        postId: ValidationTypes.idValidation('Post').required()
    })
};

const getCommentsByPost = {
    params: Joi.object().keys({
        postId: ValidationTypes.idValidation('Post').required(),
    }),
    query: Joi.object().keys({
            page: Joi.number().optional().default(1),
            limit: Joi.number().optional().default(20),
    })
};

const deleteComment = {
    params: Joi.object().keys({
        commentId: ValidationTypes.idValidation('Comment').required(),
    }),
};

module.exports = {createComment, getCommentsByPost, deleteComment};