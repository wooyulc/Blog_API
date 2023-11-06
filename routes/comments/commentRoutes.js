// commentRoutes.js
const express = require('express');
const { commentCreateCtrl,
    commentsCtrl, 
    commentDeleteCtrl, 
    commentUpdateCtrl
} = require('../../controllers/comments/commentCtrl');
const isLogin = require('../../middlewares/isLogin');

const commentRouter = express.Router();

// POST/api/v1/comments
commentRouter.post('/:id', isLogin, commentCreateCtrl);

// GET/api/v1/comments
commentRouter.get('/', commentsCtrl);

// DELETE/api/v1/comments/:id
commentRouter.delete('/:id', isLogin, commentDeleteCtrl);

// PUT/api/v1/comments/:id
commentRouter.put('/:id', isLogin, commentUpdateCtrl);

module.exports = commentRouter