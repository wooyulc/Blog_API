// User.js 
const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const Post = require('../Post/Post');


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
        userAward: {
            type: String,
            enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
            default: 'Bronze'
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    {
        timestamps: true,
        toJSON:{virtuals: true}
    }
);
// Hooks 
// pre-before record is saved 
userSchema.pre("findOne", async function(next){
    this.populate({
        path:'posts'
    });
    // get the user id 
    const userId = this._conditions._id;
    // find the post created by the user
    const posts = await Post.find({ user: userId });
    // get the last post created by the user
    const lastPost = posts[posts.length-1];
    // get last post date
    const lastPostDate = new Date(lastPost?.createdAt);
    const lastPostDateString = lastPostDate.toDateString();
    // add virtuals to the schema
    userSchema.virtual('lastPostDate').get(function() {
        return lastPostDateString;
    });
    // check if user is inactive for 30days
    // get current date 
    const currentDate = new Date();
    // get the differnce between the last post date and the current date 
    const diff = currentDate - lastPostDate;
    // get thet difference in days and return less than in days
    const diffDays = diff / (10000*3600*24);

    if(diffDays > 30) {
        // Add virtuals isInactive tot the schema to check if a user is inactive for 30days
        userSchema.virtual('isInactive').get(function(){
            return true;
        });
         // find the user by ID and update
        await User.findByIdAndUpdate(userId, {
            isBlocked: true,
        },
        {
            new: true,
        });
    }else{
        userSchema.virtual('isInactive').get(function(){
            return false;
        });
        // find the user by ID and update
        await User.findByIdAndUpdate(userId, {
            isBlocked: false,
        },
        {
            new: true,
        });
    }

    // last active date
    const daysAgo = Math.floor(diffDays);
    // add virtuals lastActive in days to thte schema
    userSchema.virtual('lastActive').get(function() {
        //check if daysAgo <= 0
        if(daysAgo <= 0){
            return 'Today';
        }

        //check if daysAgo = 1
        if(daysAgo > 0){
            return `${daysAgo} days ago`;
        }

        // check if daysAgo = 1
        if(daysAgo === 1){
            return 'Yesterday';
        }
    });
      //----------------------------------------------
  //Update userAward based on the number of posts
  //--------------------------------------------
  //get the number of posts
  const numberOfPosts = posts.length;
  //check if the number of posts is less than 10
  if (numberOfPosts <= 0) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Bronze",
      },
      {
        new: true,
      }
    );
  }
  //check if the number of posts is greater than 10
  if (numberOfPosts > 10) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Silver",
      },
      {
        new: true,
      }
    );
  }

  //check if the number of posts is greater than 20
  if (numberOfPosts > 20) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Gold",
      },
      {
        new: true,
      }
    );
}
  next();
});

// post-after saving//create
userSchema.post('save', function(next){

});
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