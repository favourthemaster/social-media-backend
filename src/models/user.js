const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        validate: {
            validator: async function(value){
                if(!value) return true;
                const existingUser = await mongoose.models.User.findOne({ username: value });
                if(existingUser){
                    const isCurrentUser = existingUser._id.toString() === this._id.toString();
                    if(isCurrentUser){
                        return true;
                    }
                    return false;
                } 
            },
            message: 'This username already exists',
        }
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        lowercase: true,
        validate: {
            validator: async function(value){
                if(!value) return true;
                const existingUser = await mongoose.models.User.findOne({ email: value });
                if(existingUser){
                    const isCurrentUser = existingUser._id.toString() === this._id.toString();
                    if(isCurrentUser){
                        return true;
                    }
                    return false;
                }
            },
            message: 'This email already exists',
        }
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,
        unique: true,
        validate: {
            validator: async function(value){
                if(!value) return true;
                const existingUser = await mongoose.models.User.findOne({ phone: value });
                if(existingUser){
                    const isCurrentUser = existingUser._id.toString() === this._id.toString();
                    if(isCurrentUser){
                        return true;
                    }
                    return false;
                }
            },
            message: 'This phone number already exists',
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    fullname: {
        type: String,
        required: false,
        trim: true,
    },
    profilePic: {
        type: String,
    },
    bio:{
        type: String,
    },
    joinedDate: {
        type: Date,
        default: Date.now,
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    ],
    followers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false
                }
            ],
    registrationExpirationTime: {
        type: Date
    }
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'userId'
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'instagramclone');
    return token;
};

userSchema.methods.clearRegistrationTimeLimit = async function () {
    const user = this;
    await User.updateOne({ _id: user._id }, { $unset: { registrationExpirationTime: "" } }, { validateBeforeSave: false });
}

// Instance Method to check if the account is locked
userSchema.methods.isAccountLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

// Instance Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Instance Method to increment failed login attempts
userSchema.methods.incrementFailedLoginAttempts = async function (maxAttempts) {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= maxAttempts) {
        this.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
    }
    await this.save({ validateBeforeSave: false });
};

// Instance Method to reset failed login attempts
userSchema.methods.resetFailedLoginAttempts = async function () {
    this.failedLoginAttempts = 0;
    this.lockUntil = undefined;
    await this.save({ validateBeforeSave: false });
};

userSchema.statics.findByCredentials = async ({username, email, phone}) => {
    const query = email ? {email} : phone ? {phone} : {username};
    const user = await User.findOne(query);
    return user;
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;