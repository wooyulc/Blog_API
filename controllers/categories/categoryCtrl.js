//categoryCtrl.js
const Category = require("../../model/Category/Category");
const { appErr } = require("../../utils/appErr");

// Create
const categoryCreateCtrl = async(req, res, next) =>{
    const { title } = req.body;
    try{
        const category = await Category.create({
            title,
            user: req.userAuth
        });
        res.json({
            status: "success",
            data: category
        });
    } catch (error) {
       return next(appErr(error.message))
    }
};

// Single
const categorySingleCtrl = async(req, res) =>{
    try{
        const category = await Category.findById(req.params.id);
        res.json({
            status: "success",
            data: category
        });
    } catch (error) {
        res.json(error.message);
    }
};

// All
const categoriesCtrl = async(req, res) =>{
    try{
        const categories = await Category.find();
        res.json({
            status: "success",
            data: categories
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Update
const categoryUpdateCtrl = async(req, res)=>{
    const { title } = req.body;
    try{
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {title},
            {
                new: true,
                runValidators: true
            }
        )
        res.json({
            status: "success",
            data: category
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Delete
const categoryDeleteCtrl = async(req, res) =>{
    
    try{
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "You have deleted the category successfully",
        });
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    categoryCreateCtrl,
    categorySingleCtrl,
    categoriesCtrl,
    categoryUpdateCtrl,
    categoryDeleteCtrl
}