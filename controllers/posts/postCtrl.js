const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

// postCtrl.js
// Create
const postCreateCtrl = async(req, res) =>{
    const { title, description } = req.body
    try{
        //find the user
        const author = await User.findById(req.userAuth);
        //create the post
        const postCreated = await Post.create({
            title,
            description,
            user: author._id,
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
        res.json(error.message);
    }
};

// Single
const postSingleCtrl = async(req, res, next) =>{
    try{
        res.json({
            status: "success",
            data: "Post route",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// All
const postsCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "posts route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Update
const postUpdateCtrl = async(req, res)=>{
    const { title, description } = req.body
    try{
        //find the user
        const author = await User.findById(req.userAuth);
        //create the post
        const postCreated = await Post.create({
            title,
            description,
            user: author._id,
        });
        // associate user to a post - push the post in to the user post array
        author.posts.push(postCreated);
        //save
        await author.save();

        res.json( {
            status: "success",
            data: "update post route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Delete
const postDeleteCtrl = async(req, res, next) =>{
    try{
        res.json({
            status: "success",
            data: "delete post route",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

module.exports = {
    postCreateCtrl,
    postSingleCtrl,
    postsCtrl,
    postUpdateCtrl,
    postDeleteCtrl
}