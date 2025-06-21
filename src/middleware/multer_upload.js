const {createUpload, UploadType} = require('../config/multer');
const ApiError = require('../utils/api_error');
const httpStatus = require('http-status');

const PROFILE_PICTURES_FOLDER = 'profile_pictures';
const POSTS_FOLDER = 'posts';

const acceptedPostMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff',
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'
];
const maxPostFileSize = 1024 * 1024 * 50; // 50MB

const uploadPost = createUpload ({
    folder: POSTS_FOLDER,
    uploadType: UploadType.POST,
    acceptedMimeTypes :acceptedPostMimeTypes,
    maxFileSize: maxPostFileSize
}).array('files', 10);



const acceptedProfilePicMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff',
];
const maxProfilePicFileSize = 1024 * 1024 * 2; // 2MB

const uploadProfilePic = createUpload ({
        folder: PROFILE_PICTURES_FOLDER,
        uploadType :UploadType.PROFILE_PIC, 
        acceptedMimeTypes :acceptedProfilePicMimeTypes,
        maxFileSize: maxProfilePicFileSize}).single('image');

module.exports = {uploadPost, uploadProfilePic}; // Corrected export as named export{}