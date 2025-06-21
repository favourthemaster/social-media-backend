const User = require('./user');
const ApiError = require('../../utils/api_error');
const httpStatus = require('http-status');
const ErrorCodes = require('../../utils/error_codes');

const MAX_LOGIN_ATTEMPTS = 5;

async function createNewUser(payload){
    const newUser = new User({...payload});
    return newUser;
}

async function updateUser({user, username, fullname, bio, profilePic}){
    user.username = username;
    user.fullname = fullname;
    user.bio = bio;
    user.profilePic = profilePic;
    user.save();
    
}

async function deleteUser(user){
    user.remove();
}

async function getUserByEmailOrPhone({email, phone}){
    if(email){
        return User.findOne({ email });
    }else{
        return User.findOne({ phone });
    }
};

async function getUserByCredentials({username, email, phone, password}){
    const user = await User.findByCredentials({username, email, phone});
    
    if (!user) {
        throw new ApiError({statusCode: httpStatus.status.NOT_FOUND, message: 'This user does not exist', code: ErrorCodes.NOT_FOUND });
    }

     // Check if the account is locked
     if (user.isAccountLocked()) { // Custom method on the User model
        throw new ApiError({
            statusCode: httpStatus.status.FORBIDDEN,
            message: 'Too many failed login attempts. Try again later',
            code: ErrorCodes.FORBIDDEN,
        });
    }

    // Validate password
    const isMatch = await user.comparePassword(password); // Instance method on User model
    if (!isMatch) {
        await user.incrementFailedLoginAttempts(MAX_LOGIN_ATTEMPTS); // Custom method on the User model
        throw new ApiError({
            statusCode: httpStatus.status.BAD_REQUEST,
            message: 'Invalid password',
            code: ErrorCodes.BAD_REQUEST,
        });
    }
    // Reset failed login attempts and unlock the account
    await user.resetFailedLoginAttempts();

    return user;
}

async function getUserById( id ){
    return User.findById(id);
};

async function getUserByUsername( username ){
    return User.findOne({ username });
};

async function getUsers(){
    return User.find();
};

async function getUsersByIds( ids ){
    return User.find({ _id: {$in: ids } });
};

async function followUser({followerUser, followingUser}){
    if(!followingUser.followers?.includes(followerUser.id)) {
        await followingUser.updateOne(
          { $push: { followers: followerUser.id } },
        );
      }
  
      if (!followerUser.following?.includes(followingUser.id)) {
        await followerUser.updateOne(
          { $push: { following: followingUser.id } },
        );
      }

};

async function unfollowUser({followerUser, followingUser}){
    if(followingUser.followers?.includes(followerUser.id)) {
        await followingUser.updateOne(
          { $pull: { followers: followerUser.id } },
        );
      }
  
      if (followerUser.following?.includes(followingUser.id)) {
        await followerUser.updateOne(
          { $pull: { following: followingUser.id } },
        );
      }

};

module.exports = {createNewUser, deleteUser, updateUser, getUserByEmailOrPhone, getUserById, getUserByCredentials, getUserByUsername, getUsers, getUsersByIds, followUser, unfollowUser};