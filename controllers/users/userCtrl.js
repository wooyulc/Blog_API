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
const whoViewProfileCtrl = async(req, res) =>{
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
            const isUserAlreadyFollowed = userToFollow.following.find(follower => follower.toString() === userWhoFollowed._id.toString());
            if(isUserAlreadyFollowed) {
                return next(appErr('You already followed this user'))
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

// All
const usersCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "users route",
        });
    } catch (error) {
        res.json("all failed");
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
    unfollowCtrl
};