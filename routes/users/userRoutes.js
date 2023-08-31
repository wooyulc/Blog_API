const express = require('express');
const { userRegisterCtrl, userLoginCtrl, userProfileCtrl, usersCtrl, userDeleteCtrl, userUpdateCtrl} = require('../../controllers/users/userCtrl');
const userRouter = express.Router();

// POST/api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

// POST/api/v1/users/login
userRouter.post('/login', userLoginCtrl);

// GET/api/users/:id
userRouter.get('/profile/:id', userProfileCtrl);

// GET/api/v1/users
userRouter.get('/', usersCtrl);

// DELETE/api/v1/users/:id
userRouter.delete('/:id', userDeleteCtrl);

// PUT/api/v1/users/:id
userRouter.put('/:id', userUpdateCtrl);

module.exports = userRouter;