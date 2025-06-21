const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../utils/api_error');
const httpStatus = require('http-status');
const ErrorCodes = require('../utils/error_codes');

const authUser = async (req, res, next) => {

    try {

        const token = req?.header('Authorization')?.replace('Bearer ', '');
        
        if(!token){
        
            throw new ApiError({statusCode: httpStatus.status.FORBIDDEN, message: 'Authorization needed', code: ErrorCodes.TOKEN_MISSING});
        
        }
        
        const decoded = jwt.verify(token, 'instagramclone');
        
        const user = decoded._id ? await User.findOne({ _id: decoded._id }) : null;
        
        if (!user) {
        
            throw new ApiError({ statusCode: httpStatus.status.FORBIDDEN, message: 'Invalid Authorization token', code: ErrorCodes.INVALID_TOKEN});
        
        }
        req.user = user;
        next();
    
    }
    catch (error) {
        next(error);
    }
}

module.exports = authUser;