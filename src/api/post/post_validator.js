const Joi = require('joi');
const ValidationTypes = require('../../utils/validation_types');

const createPost = {
    body: Joi.object().keys({
        aspectRatio: Joi.number().required(),
        caption: Joi.string().optional(),
        collaborators: Joi.array().items(
            ValidationTypes.idValidation('User')
        ).optional(),
        mentioned: Joi.array().items(
            ValidationTypes.idValidation('User')
        ).optional(),
        metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
    })
};

const getPostsWithPagination = {
    query: Joi.object().keys({
        page: Joi.number().optional().default(1),
        limit: Joi.number().optional().default(10),
    })
};

const likePost = {
    body: Joi.object().keys({
        postId: ValidationTypes.idValidation('Post'),
    })
};

const unlikePost = {
    body: Joi.object().keys({
        postId: ValidationTypes.idValidation('Post'),
    })
};

module.exports = {createPost, getPostsWithPagination, likePost, unlikePost};