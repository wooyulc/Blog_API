// User.js 
const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

// create schema
const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, 'First Name is required']
        },
        lastname: {
            type: String,
            required: [true, 'Last Name is required']
        },
        profilePhoto: {
            ttype: String
        },
        email: {
            type: String,
            required: [true, 'Emailis required']
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['Admin', 'Geust', 'Editor'],
        },
        viewers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        }],
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        }],
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        blocking: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
        plan: {
            type: String,
            enum: ['Free', 'Premium', 'Pro'],
            default: 'Free'
        },
        userReward: [{
            type: String,
            enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
            default: 'Bronze'
        }]
    },
    {
        timestamps: true,
        toJSON:{virtuals: true}
    }
);

//Get fullname
userSchema.virtual('fullname').get(function(){
    return `${this.firstname} ${this.lastname}`;
})
//get user initials
userSchema.virtual('initials').get(function(){
    return `${this.firstname[0]}${this.lastname[0]}` 
})

//get user postCounts
userSchema.virtual('postCounts').get(function(){
    return this.posts.length; 
})

//get followingCounts
userSchema.virtual('followingCounts').get(function(){
    return this.following.length; 
})

//get followersCounts
userSchema.virtual('followersCounts').get(function(){
    return this.followers.length; 
})

//get viewersCount
userSchema.virtual('viewersCount').get(function(){
    return this.viewers.length; 
})

//get blockCount
userSchema.virtual('blockCount').get(function(){
    return this.blocking.length; 
})

// Compile the user model
const User = mongoose.model('User', userSchema);
module.exports = User;