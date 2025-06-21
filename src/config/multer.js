const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {cloudinary} = require('../config/cloudinary');
const ApiError = require('../utils/api_error');
const httpStatus = require('http-status');
const ErrorCodes = require('../utils/error_codes');

const UploadType = Object.freeze({
  POST: 'post',
  STORY: 'story',
  PROFILE_PIC: 'profilePicture'
});

const storage = (folder, uploadType) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if the uploaded file is an image and apply transformation
    return {
      folder: folder, // The folder where the files will be stored in Cloudinary
      resource_type: 'auto', // Accepts all file types
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'mp4','mpeg', 'quicktime', 'x-msvideo', 'x-ms-wmv' ],
      public_id: `${uploadType}-${Date.now()}`,
      transformation: uploadType === UploadType.PROFILE_PIC
        ? [
            {
              width: 300,
              height: 300,
              crop: 'scale', 
            },
          ]
        : undefined, // No transformation for non-image files
    };
  },
});



// Function to create file filter
const createFileFilter = (acceptedMimeTypes) => (req, file, cb) => {
    if (acceptedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError({ statusCode: httpStatus.status.BAD_REQUEST, message: 'Unsupported file type', code: ErrorCodes.FILE_UPLOAD_ERROR}), false);
    }
};


// Function to create multer instance
const createUpload = ({folder, uploadType, acceptedMimeTypes,  maxFileSize}) => multer({
    storage: storage(folder, uploadType),
    limits: {
        fileSize: maxFileSize,
        files: uploadType === UploadType.PROFILE_PIC ? 1 : 10
    },
    fileFilter: createFileFilter(acceptedMimeTypes)
});

module.exports = { createUpload , UploadType};