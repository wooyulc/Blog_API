// isAdmin.js
const User = require("../model/User/User");
const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");
User

const isAdmin = async (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req);

    //verfy the token
    const decodedUser = verifyToken(token);
    // save the user into req obj
    req.userAuth = decodedUser.id;

    //find the user in DB
    const user = await User.findById(decodedUser.id);
    console.log("decodedUser",decodedUser.id);
 
    // check if admin
    if(user.isAdmin) {
        return next()
        console.log("hi");
    }else{
        return next (appErr("Access Denied", 403));
        console.log("hi2");
    }
}

module.exports = isAdmin;