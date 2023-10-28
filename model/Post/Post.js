// Post.js
const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

// create schema
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Post Title is requrierd'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Post description is requrierd'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            //required: [true, "Post catetgory is required"],
        },
        numViews:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        dislikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // who creates posts
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Please Author is required"]
        },
        photo: {
            type: String,
            //required: [true, "Post Image is requried"]
        }
    },
    {
        timestamps: true
    }
);

// Compile the user model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;