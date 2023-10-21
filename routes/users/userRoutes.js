const express = require('express');
const storage = require('../../config/cloudinary');
const { 
    userRegisterCtrl, 
    userLoginCtrl, 
    userProfileCtrl, 
    usersCtrl, 
    userDeleteCtrl, 
    userUpdateCtrl,
    whoViewProfileCtrl,
    profilePhotoUploadCtrl,
    followingCtrl,
    unfollowCtrl,
    blockCtrl,
    unblockCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl
} = require('../../controllers/users/userCtrl');
const isLogin = require('../../middlewares/isLogin');
const multer = require('multer');
const isAdmin = require('../../middlewares/isAdmin');
const userRouter = express.Router();

// instance of multer
const upload = multer({ storage})

// POST/api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

// POST/api/v1/users/login
userRouter.post('/login', userLoginCtrl);

// GET/api/users/:id
userRouter.get('/profile', isLogin, userProfileCtrl);

// GET/api/v1/users
userRouter.get('/', usersCtrl);

// GET/api/v1/users/profile_viewers/:id
userRouter.get('/profile-viewers/:id', isLogin, whoViewProfileCtrl); 

// GET/api/v1/users/following/:id
userRouter.get('/following/:id', isLogin, followingCtrl); 

// GET/api/v1/users/unfollowing/:id
userRouter.get('/unfollowing/:id', isLogin, unfollowCtrl); 

// GET/api/v1/users/block/:id
userRouter.get('/block/:id', isLogin, blockCtrl); 

// GET/api/v1/users/unblock/:id
userRouter.get('/unblock/:id', isLogin, unblockCtrl); 

// PUT/api/v1/users/adminBlockUserCtrl/:id
userRouter.put('/admin-block/:id', isLogin, isAdmin, adminBlockUserCtrl); 

// PUT/api/v1/users/adminUnblockUserCtrl/:id
userRouter.put('/admin-unblock/:id', isLogin, isAdmin, adminUnblockUserCtrl); 

// DELETE/api/v1/users/:id
userRouter.delete('/:id', userDeleteCtrl);

// PUT/api/v1/users/:id
userRouter.put('/:id', userUpdateCtrl);
 
// POST/api/v1/users/profile-photo-upload
userRouter.post('/profile-photo-upload', 
isLogin, 
upload.single('profile'),
profilePhotoUploadCtrl,
);


module.exports = userRouter;