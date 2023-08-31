// Comment.js 
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: [true, "Post is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User is required"],
        },
        description: {
            type: String,
            requried: [true, "Comment description is requried"],
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;