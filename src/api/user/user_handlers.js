const httpStatus = require('http-status');
const ApiError = require('../../utils/api_error');
const ErrorCodes = require('../../utils/error_codes');
const response = require('../../utils/response');
const services = require('./user_services');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const User = require('./user');

async function loginHandler(req, res, next){

    const payload = req.body;

    try {

        const {username, email, phone, password} = payload;

        const user = await services.getUserByCredentials({username, email, phone, password});
        
        const token = await user.generateAuthToken();
        
        res.send(response({data:{user, token}}));
        
    } catch (error) {
        next(error);
    }
};

async function createBaseUserHandler(req, res, next){

    const payload = req.body;

    try {

        const registrationExpirationTime = new Date();

        registrationExpirationTime.setHours(registrationExpirationTime.getHours() + 24); 

        const newUser = await services.createNewUser({...payload, registrationExpirationTime});

        const token = await newUser.generateAuthToken();

        await newUser.save();

        res.status(200).send(response({ data: {user: newUser, token: token} }));

    } catch (error) {
        next(error);
    }
};

async function createFinalUserHandler(req, res, next){

    try {
        const user = req.user;

        if(!user){

            throw new ApiError({statusCode: httpStatus.BAD_REQUEST, message: 'This User does not exist', code: ErrorCodes.INVALID_CREDENTIALS});

        }

        if (new Date() > user.expirationTime) {

            await services.deleteUser(user);

            throw new ApiError({statusCode: httpStatus.BAD_REQUEST, messsage: 'User registration has expired', code: ErrorCodes.SESSION_EXPIRED});

        }

        

        if(req.file && user.profilePic){

            await cloudinary.deleteProfilePic(path.basename(user.profilePic));

        }
        await user.clearRegistrationTimeLimit();
        await services.updateUser({user, ...req.body, profilePic: req.file.path})


        res.status(200).send(response({ data: {user: user} }));

    } catch (error) {

        if(req.file){

                await cloudinary.deleteProfilePic(req.file.filename);
        }

        next(error);
    }
};

async function getUsersHandler(req, res, next){
    try {

        const users = await services.getUsers();
         
        if(!users){
            throw new ApiError({statusCode: httpStatus.NOT_FOUND, message: 'Cant find any users', code: ErrorCodes.USER_NOT_FOUND});
        }

        res.send(response({success: true, data: { users }}));

    } catch (error) {

        next(error);

    }
};

async function getUsersByIdsHandler(req, res, next){

    try {
        const { ids } = req.body;

        const users = await services.getUsersByIds( ids );

        if(!users || users.length === 0){
            
            throw new ApiError({statusCode: httpStatus.NOT_FOUND, message: 'No users found with ids', code: ErrorCodes.USER_NOT_FOUND});

        }

        res.send(response({success: true, data: { users }}));

    } catch (error) {

        next(error);
    }

};

async function followUserHandler(req, res, next){
    try {
        const payload = req.body;
        const {userId} = payload;
        if(req.user.id === userId){
            throw new ApiError({statusCode: httpStatus.status.BAD_REQUEST, code: ErrorCodes.BAD_REQUEST, message: 'The provided user id should not be the same as your own id'});
        } 
        const followingUser = await services.getUserById(userId);

        if(!followingUser){
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'This User could not be found'});
        }
        await services.followUser({followerUser: req.user, followingUser});
        res.send(response({success:true}));
        
    } catch (error) {
        next(error);
    }
};

async function unfollowUserHandler(req, res, next){
    try {
        const payload = req.body;
        const {userId} = payload;
        if(req.user.id === userId){
            throw new ApiError({statusCode: httpStatus.status.BAD_REQUEST, code: ErrorCodes.BAD_REQUEST, message: 'The provided user id should not be the same as your own id'});
        } 
        const followingUser = await services.getUserById(userId);

        if(!followingUser){
            throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, code: ErrorCodes.NOT_FOUND, message: 'This User could not be found'});
        }
        await services.unfollowUser({followerUser: req.user, followingUser});
        res.send(response({success:true}));
        
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginHandler,
    createBaseUserHandler,
    createFinalUserHandler,
    getUsersHandler,
    getUsersByIdsHandler,
    followUserHandler,
    unfollowUserHandler
};