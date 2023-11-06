const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const { appErr } = require("../../utils/appErr");

// postCtrl.js
// Create
const postCreateCtrl = async(req, res, next) =>{
    console.log(req.file);
    const { title, description, category } = req.body
    try{
        //find the user
        const author = await User.findById(req.userAuth);
        // check if the user is blocked
        if (author.isBlocked){
            return next(appErr("Access denied", 403))
        }

        //create the post
        const postCreated = await Post.create({
            title,
            description,
            user: author._id,
            category,
            photo: req?.file?.path
        });
        // associate user to a post - push the post in to the user post array
        author.posts.push(postCreated);
        //save
        await author.save();
        
        res.json( {
            status: "You have successfully created the post",
            data: postCreated,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// Single
const postDetailCtrl = async(req, res, next) =>{
    try{
        const post = await Post.findById(req.params.id);
        // check the num of views
        // check if user viewed this post 
        const isViewed = post.numViews.includes(req.userAuth);
        if(isViewed) {
            return false;
            res.json({
                status: "success",
                data: post,
            });
        }else {
            post.numViews.push(req.userAuth);
            await post.save();
            res.json({
                status: "success",
                data: post,
            });
        }    
    } catch (error) {
        next(appErr(error.message));
    }
};

// like
const likePostCtrl = async(req, res, next) =>{
    try{
        // Get the post
        const post = await Post.findById(req.params.id);
        // check if the user has already liked the post
        const isLiked = post.likes.includes(req.userAuth);
        // If the user has already liked the post, unlike the post
        if(isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString())
            await post.save();
        } else {
            post.likes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: "success",
            data: "you have liked the post successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// dislike
const dislikePostCtrl = async(req, res, next) =>{
    try{
        // Get the post
        const post = await Post.findById(req.params.id);
        // check if the user has already disliked the post
        const isDisliked = post.dislikes.includes(req.userAuth);
        // If the user has already disliked the post, unlike the post
        if(isDisliked) {
            post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== req.userAuth.toString())
            await post.save();
        } else {
            post.dislikes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: "success",
            data: "you have disliked the post successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// All
const postsCtrl = async(req, res, next) =>{
    try{
        const posts = await Post.find({})
            .populate('user')
            .populate('category','title');
        // Check if the user is blocked the post owner
        const filterPosts = posts.filter(post=>{
            // get all blocked user
            const blockedUser = post.user.blocking;
            const isBlocked = blockedUser.includes(req.userAuth);
            return isBlocked ? null : post;
        });

        res.json({
            status: "success",
            data: filterPosts
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// Update
const postUpdateCtrl = async(req, res, next)=>{
    const { title, description, category } = req.body
    try{
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belongs to the user
        if(post.user.toString() !== req.userAuth.toString()){
            return next(appErr("You are not allowed to update this post", 403));
        }
        await Post.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            photo: req?.file?.path
        },
        {
            new: true
        });

        res.json( {
            status: "success",
            data: post
        });
    } catch (error) {
        next(appErr(err.message))
    }
};

// Delete
const postDeleteCtrl = async(req, res, next) =>{
    try{
        //req.params.id = post id
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this post", 403));
        }
        await Post.findByIdAndDelete(req.params.id);
        
        res.json({
            status: "success",
            data: "You have deleted the post successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

module.exports = {
    postCreateCtrl,
    postDetailCtrl,
    postsCtrl,
    postUpdateCtrl,
    postDeleteCtrl,
    likePostCtrl,
    dislikePostCtrl
}
