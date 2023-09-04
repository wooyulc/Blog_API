// isLogin.js
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

getTokenFromHeader
const isLogin = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req);
    //verfy the token
    const decodedUser = verifyToken(token);
    // save the user into req obj
    req.userAuth = decodedUser.id;

    if(!decodedUser) {
        return res.json({
            message: "Invalid/Expired token, please login back",
        });
    }else{
        next();
    }

    

}

module.exports = isLogin;