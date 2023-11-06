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
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        // who creates posts
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Please Author is required"]
        },
        photo: {
            type: String,
            required: [true, "Post Image is requried"]
        }
    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
);

// Hook
postSchema.pre(/^find/, function(next){
    // add views count as virtual field
    postSchema.virtual('viewsCount').get(function(){
        const post = this;
        return post.numViews.length;
    });
   
    postSchema.virtual('likesCount').get(function(){
        const post = this;
        return post.likes.length;
    });
   
    postSchema.virtual('dislikesCount').get(function(){
        const post = this;
        return post.dislikes.length;
    });

    postSchema.virtual('likesPercentage').get(function(){
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.likes.length / total) * 100
        return `${percentage}%`;
    });

    postSchema.virtual('dislikesPercentage').get(function(){
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.dislikes.length / total) * 100
        return `${percentage}%`;
    });

    postSchema.virtual('daysAgo').get(function(){
        const post = this;
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now()-date)/86400000);
        return daysAgo === 0 ? `Today`: daysAgo ===1 ? "yesterday" : `${daysAgo} days ago`;
    });
    next()
})
// Compile the user model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;