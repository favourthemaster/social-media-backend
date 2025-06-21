const logger = require('../config/logger');
const multer = require('multer');
const ErrorCodes = require('../utils/error_codes');
const response = require('../utils/response');
const ApiError = require('../utils/api_error');
const {deletePosts} = require('../config/cloudinary');

const errorMessages = Object.freeze({
    FILE_SIZE_LIMIT: 'The uploaded file exceeds the size limit allowed.',
    UNEXPECTED_FILE: 'Unexpected file recieved',
    EXCEEDED_FILE_COUNT: 'Exceeded max file count',
    GENERAL_UPLOAD_ERROR: 'An error occurred during file upload.',
    FALLBACK: 'An unexpected error occurred.',
});


const errorHandler = async (err, req, res, next) =>  {
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    if (err.name === 'ValidationError') {
        // Handle Mongoose validation errors
        const errors = Object.keys(err.errors).map(
          (field) => `${err.errors[field].message}`
        );
        const firstError = errors[0];
        return res.status(400).send(response({success: false, code: ErrorCodes.DUPLICATE_CREDENTIALS, errorMessage: firstError }));
    }

    if (err instanceof multer.MulterError) {
        await deletePosts(req.files.map((file) => file.path));
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).send(response({success: false, code: ErrorCodes.FILE_TOO_LARGE, errorMessage: errorMessages.FILE_SIZE_LIMIT}));
            case 'LIMIT_FILE_COUNT':
                return res.status(400).send(response({success: false, code: ErrorCodes.INVALID_FILE_TYPE, errorMessage: errorMessages.EXCEEDED_FILE_COUNT}));
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).send(response({success: false, code: ErrorCodes.INVALID_FILE_TYPE, errorMessage: errorMessages.UNEXPECTED_FILE}));
            default:
                return res.status(400).send(response({success: false, code: ErrorCodes.FILE_UPLOAD_ERROR, errorMessage: errorMessages.GENERAL_UPLOAD_ERROR}));
        }
    }

    if(err instanceof ApiError){
        return res.status(err.statusCode).send(response({success: false, code: err.code, errorMessage: err.message}));    
    }

    return res.status(err.status || 500).send(response({success: false, code: ErrorCodes.SERVER_ERROR, errorMessage: err.message || errorMessages.FALLBACK}));
}

module.exports = errorHandler;