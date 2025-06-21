const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        require: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;