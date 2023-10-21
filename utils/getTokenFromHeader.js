const getTokenFromHeader = req =>{
    // get token from header
    const headerObj = req.headers;
    if(!headerObj) {
        console.log("headerObj empty")
    }
    console.log("headerObj", headerObj)
    const token = headerObj["authorization"]?.split(" ")[1];
    console.log("token", token);
    if (token !== undefined){
        return token
    }
    else {
        false;
    }   
};

module.exports = getTokenFromHeader;