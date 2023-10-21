const User = require("../../model/User/User");
const bcrypt = require('bcryptjs');
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");
const {appErr, AppErr} = require("../../utils/appErr");
const multer = require('multer');

// Register
const userRegisterCtrl = async(req, res, next) =>{
    const {
        firstname, 
        lastname, 
        email, 
        password
    } = req.body;

    try{
        //check if email exist
        const userFound = await User.findOne({email});
        if(userFound){
            return next(new AppErr("User Already Exist", 500));
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const user = await User.create({
            firstname, 
            lastname, 
            email, 
            password: hashedPassword
        });
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        next("Login failed");
    }
};

// Login
const userLoginCtrl = async(req, res, next) =>{
    const {email, password} = req.body;
    try{
        // check if email exist
        const userFound = await User.findOne({email});
        if(!userFound) {
            return next(appErr("Invalid login credentials"));
        }

        // Verify Password
        const isPasswordMatched = await bcrypt.compare(
            password, 
            userFound.password
        );

        if(!isPasswordMatched) {
            if (!userFound) {
                return next(appErr("Invalid login credentials"));
            }
        }
       
        res.json({
            status: "success",
            data: {
                firstname: userFound.firstname,
                lastanme: userFound.lastname,
                email: userFound.email,
                token: generateToken(userFound._id)
            }
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

// who view the profile
const whoViewProfileCtrl = async(req, res, next) =>{
    try{
        // 1. find the original user 
        const user = await User.findById(req.params.id);
        // 2. find the user who viewed the orignal user
        const userWhoViewed = await User.findById(req.userAuth);
        // 3. check if original and who viewed are found 
        if(user && userWhoViewed) {
            // 4. check if userWhoViewed is already in the users viewers array
            const isAlreadyViewed = user.viewers.find(viewers => viewers.toString() === userWhoViewed._id.toJSON());
            if(isAlreadyViewed) {
                return next(appErr("You already viewed this profile"));
            }
            else {
                // 5. Push the userWhoViewed to the user's viewers array
                user.viewers.push(userWhoViewed._id);
                // 6. save the user
                await user.save();
                res.json({
                    status: "success",
                    data: "who view my profile",
                });
            }
        }
    } catch (error) {
        res.json(error.message);
    }
};

// following
const followingCtrl = async(req, res, next) =>{
    try{
        // find the user to follow
        const userToFollow = await User.findById(req.params.id);
        // find the user who is following
        const userWhoFollowed = await User.findById(req.userAuth);

        // check if user and userWhoFollowed are found
        if(userToFollow && userWhoFollowed) {
            // check if userWhofollowed is already in the user's followers array
            const isUserAlreadyFollowed = userToFollow.followers.find(
                follower => follower.toString() === userWhoFollowed._id.toString());
            if(isUserAlreadyFollowed) {
                return next(appErr('You have already followed this user'))
            } else {
                // push userWhoFollowed into the user's followers array
                userToFollow.followers.push(userWhoFollowed._id);
                // push UserToFollow into the userWhoFollowed's following array
                userWhoFollowed.following.push(userToFollow._id);
                // save 
                await userWhoFollowed.save();
                await userToFollow.save();     
                res.json({
                    status: "success",
                    datat: "You have successfully followed this user"
                })
            }
        }
    } catch (error) {
        res.json(error.message);
    }
};

// block
const blockCtrl = async(req, res, next) =>{
    try {
        //1. Find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        //2. Find the user who blocks
        const userWhoBlock = await User.findById(req.userAuth);
        //3. Check if user and userToBeBlocked are found
        if (userToBeBlocked && userWhoBlock) {
          //4. Check if userWhoBlock is already in the user's blocked array
          const isUserAlreadyBlocked = userWhoBlock.blocking.find(
            blocking => blocking.toString() === userToBeBlocked._id.toString()
          );
          if (isUserAlreadyBlocked) {
            return next(appErr("You have already blocked this user"));
          } else {
            //5. push userToBeBlocked into the user's blocking array
            userWhoBlock.blocking.push(userToBeBlocked._id);
            //save the user
            await userWhoBlock.save();
            res.json({
              status: "success",
              data: "You have successfully blocked this user",
            });
          }
        }
    } catch (error) {
        next(appErr(error.message));
    }
};

// unblock
const unblockCtrl = async(req, res, next) =>{
    try {
         //1. Find the user to be unblocked
         const userToBeUnblocked = await User.findById(req.params.id);
         //2. Find the user who is unblocking
         const userWhoUnblock = await User.findById(req.userAuth);
         //3. Check if user and userToBeUnblocked are found
         if (userToBeUnblocked && userWhoUnblock) {
           //4. Check if userToBeUnblocked is already in the user's blocked array
           const isUserAlreadyBlocked = userWhoUnblock.blocking.find(
            blocking => blocking.toString() === userToBeUnblocked._id.toString()
           );
           if (!isUserAlreadyBlocked) {
             return next(appErr("You have not blocked this user"));
           } else {
             //5. remove userToBeUnblocked from the main user
             userWhoUnblock.blocking = userWhoUnblock.blocking.filter(
                blocking => blocking.toString() !== userToBeUnblocked._id.toString());
             //save the user
             await userWhoUnblock.save();
             res.json({
               status: "success",
               data: "You have successfully unblocked this user",
             });
           }
         }
    } catch (error) {
        next(appErr(error.message));
    }
};

// Profile
const userProfileCtrl = async(req, res, next) =>{
    try{
        const user = await User.findById(req.userAuth);
        res.json({
            status: "success",
            data: user
        });
    } catch (error) {
        next("profile not failed");
    }
};

// unfollow
const unfollowCtrl = async(req, res, next) =>{
    try {
        //1. Find the user to unfolloW
        const userToBeUnfollowed = await User.findById(req.params.id);
        //2. Find the user who is unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth);
        //3. Check if user and userWhoUnFollowed are found
        if (userToBeUnfollowed && userWhoUnFollowed) {
            //4. Check if userWhoUnfollowed is already in the user's followers array
            const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(
            follower => follower.toString() === userWhoUnFollowed._id.toString()
            );
            if (!isUserAlreadyFollowed) {
            return next(appErr("You have not followed this user"));
            } else {
            //5. Remove userWhoUnFollowed from the user's followers array
            userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
                follower => follower.toString() !== userWhoUnFollowed._id.toString()
            );
            //save the user
            await userToBeUnfollowed.save();
            //7. Remove userToBeInfollowed from the userWhoUnfollowed's following array
            userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
                following =>
                following.toString() !== userToBeUnfollowed._id.toString()
            );

            //8. save the user
            await userWhoUnFollowed.save();
            res.json({
                status: "success",
                data: "You have successfully unfollowed this user",
            });
            }
        }
 } catch (error) {
   next(appErr(error.message));
 }
};

// admin block
const adminBlockUserCtrl = async(req, res, next) =>{
    try{
         //1. find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        //2. Check if user found
        if (!userToBeBlocked) {
        return next(appErr("User not Found"));
        }
        //Change the isBlocked to true
        userToBeBlocked.isBlocked = true;
        //4.save
        await userToBeBlocked.save();
        res.json({
            status: "success",
            data: "You have successfully blocked this user as Admin",
        });
    } catch (error) {
        res.json("all failed");
    }
};

// admin unblock
const adminUnblockUserCtrl = async(req, res, next) =>{
    try{
         //1. find the user to be unblocked
        const userToBeUnblocked = await User.findById(req.params.id);
        //2. Check if user found
        if (!userToBeUnblocked) {
        return next(appErr("User not Found"));
        }
        //Change the isBlocked to true
        userToBeUnblocked.isBlocked = false;
        //4.save
        await userToBeUnblocked.save();
        res.json({
            status: "success",
            data: "You have successfully unblocked this user as Admin",
        });
    } catch (error) {
        res.json("all failed");
    }
};

// All
const usersCtrl = async(req, res) =>{
    try{
        const users = await User.find();
        res.json({
            status: "success",
            data: users,
        });
    } catch (error) {
        res.json(error.message)
    }
};

// Delete
const userDeleteCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "delete user route",
        });
    } catch (error) {
        res.json("delete failed");
    }
};

// Update
const userUpdateCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "update user route",
        });
    } catch (error) {
        res.json("update failed");
    }
};

// Profile Photo Upload
const profilePhotoUploadCtrl = async(req, res, next) =>{  
    console.log(req.file)
    try {
        //1. Find the user to be updated
        const userToUpdate = await User.findById(req.userAuth);
        //2. check if user is found
        if(!userToUpdate) {
            return next(appErr('User not found', 404));
        }
        //3. check if user is blocked
        if(userToUpdate.isBlocked) {
            return next(appErr('Action is not allowed, your account is blocked', 403));
        }
        //4. check if a user is updating their photo 
        if(req.file) {
            //5. Update profile photo
            await User.findByIdAndUpdate(
                req.userAuth, 
                {
                    $set:{
                        profilePhoto: req.file.path,
                    },
                },
                {
                    new: true,
                }

            );
            res.json({
                status: "success",
                data: "You have successfully upadted your profile photo"
                }
            );
      }
  } catch (error) {
    res.json("Photo upload failed");
  }
};


module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrl,
    userDeleteCtrl,
    userUpdateCtrl,
    profilePhotoUploadCtrl,
    whoViewProfileCtrl,
    followingCtrl,
    unfollowCtrl,
    blockCtrl,
    unblockCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl
};