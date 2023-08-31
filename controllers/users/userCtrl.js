// userCtrl.js

// Register
const userRegisterCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "user registered",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Login
const userLoginCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "user login",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Profile
const userProfileCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "Profile route",
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