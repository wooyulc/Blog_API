const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const Comment = require("../../model/Comment/Comment")
const { appErr } = require("../../utils/appErr");


// CommentCtrl.js
// Create
const commentCreateCtrl = async(req, res, next) =>{
    const { description} = req.body;
    try{
        //Find the post
        const post = await Post.findById(req.params.id);
        // craete comment
        const comment = await Comment.create({
            post: post._id,
            description,
            user: req.userAuth,
        })
        //push the comment to post
        post.comments.push(comment._id);
        //find the user
        const user = await User.findById(req.userAuth);
        // push the user to user
        user.comments.push(comment._id);
        // save
        //disable validation
        await user.save({validateBeforeSave:false});
        await post.save({validateBeforeSave:false});
   
        //pust to user
        res.json({
            status: "success",
            data: comment
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// All
const commentsCtrl = async(req, res, next) =>{
    try{
        const comments = await Comment.find();
        res.json({
            status: "success",
            data: comments,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// Update
const commentUpdateCtrl = async(req, res, next)=>{
    const { description } = req.body;
    try{
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to update this post", 403));
        }
        const category = await Comment.findByIdAndUpdate(
            req.params.id,
            {description},
            {
                new: true,
                runValidators: true
            }            
        )
        res.json({
            status: "success",
            data: category
            });
    } catch (error) {
        next(appErr(error.message))
    }
};
// Delete
const commentDeleteCtrl = async(req, res, next) =>{
    try{
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this post", 403));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "The comment has been deleted successfully.",
        });
    } catch (error) {
        next(appErr(error.message))
    }
};

module.exports = {
    commentCreateCtrl,
    commentsCtrl,
    commentUpdateCtrl,
    commentDeleteCtrl
}