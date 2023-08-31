// categoryRoutes.js
const express = require('express');
const { categoryCreateCtrl, categorySingleCtrl, categoriesCtrl, categoryDeleteCtrl, categoryUpdateCtrl} = require('../../controllers/categories/categoryCtrl');
categoryCreateCtrl
const categoryRouter = express.Router();

// POST/api/v1/categories
categoryRouter.post('/', categoryCreateCtrl);

// GET/api/v1/categories/:id
categoryRouter.get('/:id', categorySingleCtrl);

// GET/api/v1/categories
categoryRouter.get('/', categoriesCtrl);

// DELETE/api/v1/categories/:id
categoryRouter.delete('/:id', categoryDeleteCtrl);

// PUT/api/v1/categories/:id
categoryRouter.put('/:id', categoryUpdateCtrl);

module.exports = categoryRouter;
