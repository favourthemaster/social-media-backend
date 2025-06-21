const httpStatus = require('http-status');
const ApiError = require('../../utils/api_error');
const response = require('../../utils/response');
const ErrorCodes = require('../../utils/error_codes');
const services = require('./post_services');

async function createPostHandler(req, res, next) {
    try {
        if(req.files.length < 1){
            throw new ApiError({statusCode: httpStatus.status.BAD_REQUEST, code: ErrorCodes.BAD_REQUEST,  message: 'Files not found'});
        }
        const payload = req.body;
        const type = (mimetype)=> {
            if (mimetype.startsWith('image')) {
                return 'image';
            }
            if (mimetype.startsWith('video')){
                return 'video';
            }
            throw new ApiError({statusCode: httpStatus.status.INTERNAL_SERVER_ERROR, code: ErrorCodes.EXTERNAL_API_ERROR, message: 'Invalid file type'});
        };

        const content = req.files.map((file) => ({ url: file.path, type: type(file.mimetype)}));

        const post = await services.createPost({ userId: req.user._id, content, ...payload });

        if(!post){

            throw new ApiError({statusCode: httpStatus.status.BAD_REQUEST, code:ErrorCodes.BAD_REQUEST, message: 'An error occured while creating the post' });
        
        }

        res.status(201).send(response({ success: true, data: { post } }));

    } catch (error) {

        next(error);

    }
}

async function getPostsHandler(req, res, next) {
    try {
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const posts = await services.getPosts({limit, skip});
        if (!posts) {
            throw new ApiError({statusCode:httpStatus.NOT_FOUND, message: 'Posts not found', code: ErrorCodes.NOT_FOUND});
        }
        res.send(response({success: true,  data: posts }));
    } catch (error) {
        next(error);
    }
}

async function updatePostHandler(req, res, next) {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const post = await services.updatePost(postId, { title, content });
        if (!post) {
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'Post not found'});
        }
        res.send(response({ data: { post } }));
    } catch (error) {
        next(error);
    }
}

async function deletePostHandler(req, res, next) {
    try {
        const { postId } = req.params;
        const post = await services.deletePost(postId);
        if (!post) {
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'Post not found'});
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

async function likePostHandler(req, res, next) {
    try {
        const {postId} = req.body;
        const post = await services.getPostById(postId);
        if (!post) {
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'Post not found'});
        }
        await services.likePost({userId: req.user.id, post});
        res.send(response({success: true}));
    } catch (error) {
        next(error);
    }
};

async function unlikePostHandler(req, res, next) {
    try {
        const {postId} = req.body;
        const post = await services.getPostById(postId);
        if (!post) {
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'Post not found'});
        }
        await services.unlikePost({userId: req.user.id, post});
        res.send(response({success: true}));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPostHandler,
    getPostsHandler,
    updatePostHandler,
    deletePostHandler,
    likePostHandler,
    unlikePostHandler
};
