//categoryCtrl.js
// Create
const categoryCreateCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "category created",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Single
const categorySingleCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "category route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// All
const categoriesCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "categories route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Update
const categoryUpdateCtrl = async(req, res)=>{
    try{
        res.json({
            status: "success",
            data: "update category route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Delete
const categoryDeleteCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "delete category route",
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