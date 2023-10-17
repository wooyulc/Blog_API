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
};