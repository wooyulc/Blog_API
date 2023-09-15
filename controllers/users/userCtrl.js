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
        profilePhoto, 
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
        next(appErr(error.message));
    }
};

// Login
const userLoginCtrl = async(req, res) =>{
    const {email, password} = req.body;
    try{
        // check if email exist
        const userFound = await User.findOne({email});
        if(!userFound) {
            return res.json({
                msg: "Invalid login Credentials"
            });
        }

        // Verify Password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password);

        if(!userFound || !isPasswordMatched) {
            return res.json({
                msg: "Invalid login Credentials"
            });
        }
       
        res.json({
            status: "success",
            data: {
                firstname: userFound.firstname,
                lastanme: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            }
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Profile
const userProfileCtrl = async(req, res) =>{
    try{
        const user = await User.findById(req.userAuth);
        res.json({
            status: "success",
            data: user
        });
    } catch (error) {
        res.json(error.message);
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
        res.json(error.message);
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
        res.json(error.message);
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
        res.json(error.message);
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
            return next(appErr('User not found', 403));
        }
        //3. check if user is blocked
        if(userToUpdate.isBlocked) {
            return next(appErr('Action is not allowed, your account is blocked', 403));
        }
        //4. check if a suer is updating their photo 
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
    next(appErr(error.message, 500));
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
};