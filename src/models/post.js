const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
        content:[{
            _id: false,
            placeholderUrl: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            type : {
                type: String,
                enum: ['video', 'image'],
                default: 'image',
                required: true
            },
        }],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        collaborators:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false
            }
        ],
        mentioned:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false
            }
        ],
        caption: {
            type: String,
            required: false
        },
        metadata: {
            type: Map,
            of: String,
            required: false
        },
        aspectRatio: {
            type: Number,
            required: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false
            }
        ],
        noOfComments: {
            type: Number,
            default: 0,
        }
    }, {
        timestamps: true
    });

    const Post = mongoose.model('Post', postSchema);
    module.exports = Post;