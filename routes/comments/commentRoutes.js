// commentRoutes.js
const express = require('express');
const { commentCreateCtrl, commentSingleCtrl, commentsCtrl, commentDeleteCtrl, commentUpdateCtrl} = require('../../controllers/comments/commentCtrl');
const commentRouter = express.Router();

// POST/api/v1/comments
commentRouter.post('/', commentCreateCtrl);

// GET/api/v1/comments/:id
commentRouter.get('/:id', commentSingleCtrl);

// GET/api/v1/comments
commentRouter.get('/', commentsCtrl);

// DELETE/api/v1/comments/:id
commentRouter.delete('/:id', commentDeleteCtrl);

// PUT/api/v1/comments/:id
commentRouter.put('/:id', commentUpdateCtrl);

module.exports = commentRouter