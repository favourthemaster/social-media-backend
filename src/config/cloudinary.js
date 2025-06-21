const cloudinary = require('cloudinary').v2;
const ApiError = require('../utils/api_error');
const ErrorCodes = require('../utils/error_codes');
const httpStatus = require('http-status');

cloudinary.config({
    cloud_name: 'dkasavogz',
    api_key: '624179676419146',
    api_secret: 'P5F1T9wie45DUjtGLRbUaMjebkA'
});

const deleteProfilePic = async (pID)=> { 
    try {
    await cloudinary.uploader.destroy(pID, {invalidate: true});
} catch (error) {
    throw new ApiError({statusCode: httpStatus.status.SERVICE_UNAVAILABLE, message: "Error deleting profile picture", code: ErrorCodes.EXTERNAL_API_ERROR});
}};

const deletePosts = async (ids) => {
    try {
        await cloudinary.api.delete_resources(ids, { invalidate: true });
    } catch (error) {
        throw new ApiError({statusCode: httpStatus.status.SERVICE_UNAVAILABLE, message: "Error deleting files", code: ErrorCodes.EXTERNAL_API_ERROR});
    }
};


module.exports = {deleteProfilePic, deletePosts, cloudinary};