// postRoutes.js
const express = require('express');
const { postCreateCtrl, postSingleCtrl, postsCtrl, postDeleteCtrl, postUpdateCtrl } = require('../../controllers/posts/postCtrl');
const postRouter = express.Router();

// POST/api/v1/posts
postRouter.post('/', postCreateCtrl);

// GET/api/v1/posts/:id
postRouter.get('/:id', postSingleCtrl);

// GET/api/v1/posts
postRouter.get('/', postsCtrl);

// DELETE/api/v1/posts/:id
postRouter.delete('/:id', postDeleteCtrl);

// PUT/api/v1/posts/:id
postRouter.put('/:id', postUpdateCtrl);

module.exports = postRouter