// postRoutes.js
const express = require('express');
const { postCreateCtrl,
        postDetailCtrl, 
        postsCtrl, 
        postDeleteCtrl, 
        postUpdateCtrl,
        likePostCtrl,
        dislikePostCtrl
    } = require('../../controllers/posts/postCtrl');

const isLogin = require('../../middlewares/isLogin');
const postRouter = express.Router();
const multer = require('multer'); 
const storage = require('../../config/cloudinary');

// file upload middlewares
const upload = multer({ storage });

// POST/api/v1/posts
postRouter.post('/', isLogin, upload.single("image"), postCreateCtrl);

// GET/api/v1/posts/:id
postRouter.get('/:id', isLogin, postDetailCtrl);

// GET/api/v1/posts
postRouter.get('/', postsCtrl);

// GET/api/v1/posts/like/:id
postRouter.get('/like/:id', isLogin, likePostCtrl);

// GET/api/v1/posts/dislike/:id
postRouter.get('/dislike/:id', isLogin, dislikePostCtrl);

// DELETE/api/v1/posts/:id
postRouter.delete('/:id', postDeleteCtrl);

// PUT/api/v1/posts/:id
postRouter.put('/:id', isLogin, upload.single("image"), postUpdateCtrl);


module.exports = postRouter