const Post = require('./post');
const cloudinary = require('../../config/cloudinary');
const path = require('path');

async function createPost({userId, aspectRatio, collaborators, mentioned, metadata, caption, content }){
    console.log(content);
    for(let i = 0; i< content.length ; i++){
        if(content[i].type == 'video'){
            const videoUrl = content[i].url;
            const thumbnailUrl = videoUrl.replace(
                "/upload/",
                "/upload/so_0,eo_1,vc_auto/"
              ).replace(/\.([a-zA-Z0-9]+)$/, ".jpg");
              content[i].placeholderUrl = thumbnailUrl;
        }else{
            const publicIdWithExtension = content[i].url.split("/upload/")[1];
            const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");
            content[i].placeholderUrl = cloudinary.cloudinary.url(publicId, {
            transformation: [
                { width: 100, height: 100, crop: "fit" } // Resize to a small placeholder
            ]
        });
        }
    }
    const newPost = new Post({userId, aspectRatio, collaborators, mentioned, metadata, caption, content});
    await newPost.save();
    return newPost;
};  

async function getPosts({userId ,limit, skip}){
    
    if(userId){
        return Post.find({userId}).sort({ createdAt: -1}).skip(skip).limit(limit);
    }   else{
        return Post.find().sort({ createdAt: -1}).skip(skip).limit(limit);
    }
};

async function getPostById(id){
    return Post.findById(id);
};

async function updatePost({postId, newComment, payload}){
    return Post.findOneAndUpdate({_id: postId},  {$push: {comments: newComment}} ,{$set : payload}, {new: true});
};

async function likePost({userId, post}){
    return post.updateOne({$push: {likes: userId}});
};

async function unlikePost({userId, post}){
    return post.updateOne({$pull: {likes: userId}});
};



module.exports = {createPost, getPosts, getPostById, updatePost, likePost, unlikePost};