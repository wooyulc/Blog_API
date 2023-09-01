const User = require("../../model/User/User");
const bcrypt = require('bcryptjs');


// Register
const userRegisterCtrl = async(req, res) =>{
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
            return res.json({
                msg: "User Already Exist"
            })
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
        res.json(error.message);
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
            data: userFound,
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Profile
const userProfileCtrl = async(req, res) =>{
    const {id} = req.params;
    try{
        const user = await User.findById(id);
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

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    usersCtrl,
    userDeleteCtrl,
    userUpdateCtrl
};