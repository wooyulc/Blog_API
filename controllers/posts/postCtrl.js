const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

// postCtrl.js
// Create
const postCreateCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "post created",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Single
const postSingleCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "Post route",
        });
    } catch (error) {
        res.json(error.message);
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
    try{
        res.json({
            status: "success",
            data: "update post route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Delete
const postDeleteCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "delete post route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    postCreateCtrl,
    postSingleCtrl,
    postsCtrl,
    postUpdateCtrl,
    postDeleteCtrl
}