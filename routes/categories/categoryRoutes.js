// categoryRoutes.js
const express = require('express');
const { 
    categoryCreateCtrl, 
    categorySingleCtrl, 
    categoriesCtrl, 
    categoryDeleteCtrl, 
    categoryUpdateCtrl
} = require('../../controllers/categories/categoryCtrl');
const isLogin = require('../../middlewares/isLogin');

const categoryRouter = express.Router();

// POST/api/v1/categories
categoryRouter.post('/', isLogin, categoryCreateCtrl);

// GET/api/v1/categories/:id
categoryRouter.get('/:id', categorySingleCtrl);

// GET/api/v1/categories
categoryRouter.get('/', categoriesCtrl);

// DELETE/api/v1/categories/:id
categoryRouter.delete('/:id', isLogin, categoryDeleteCtrl);

// PUT/api/v1/categories/:id
categoryRouter.put('/:id', isLogin, categoryUpdateCtrl);

module.exports = categoryRouter;
