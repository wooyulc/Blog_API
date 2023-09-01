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
        postCount: {
            type: Number,
            default: 0,
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
        viewedBy: [{
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
        active: {
            type: Boolean,
            default: true,
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
    },
    {
        timestamps: true
    }
);

// Compile the user model
const User = mongoose.model('User', userSchema);
module.exports = User;