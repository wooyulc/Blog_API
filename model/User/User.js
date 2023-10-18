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
        plan: [{
            type: String,
            enum: ['Free', 'Premium', 'Pro'],
            default: 'Free'
        }],
        userReward: [{
            type: String,
            enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
            default: 'Bronze'
        }]
    },
    {
        timestamps: true
    }
);

// Compile the user model
const User = mongoose.model('User', userSchema);
module.exports = User;