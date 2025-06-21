const Comment = require('./comment');
const Post = require('../post/post');

async function createComment({ postId, comment, userId }){
    const newComment = new Comment({postId, userId, comment});
    await newComment.save();
    await Post.findByIdAndUpdate(
        postId,
        {
          $inc: { numberOfComments: 1 },  // Increment the numb of comments
        },
        { new: true }
      );
    return newComment;
};

async function getCommentsByPost({postId ,limit, skip}){
    return Comment.find({postId}).sort({ createdAt: -1}).skip(skip).limit(limit);
};

async function deleteComment({commentId}){
    await Post.findByIdAndUpdate(
        Comment.findById(commentId),
        {
            $inc: { numberOfComments: -1 },
        },
        { new: true }
      );
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    return deletedComment;
};

module.exports = {createComment, getCommentsByPost, deleteComment};

