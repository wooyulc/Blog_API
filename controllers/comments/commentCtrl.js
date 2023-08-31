// CommentCtrl.js
// Create
const commentCreateCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "comment created",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Single
const commentSingleCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "Comment route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// All
const commentsCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "comments route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Update
const commentUpdateCtrl = async(req, res)=>{
    try{
        res.json({
            status: "success",
            data: "update comment route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

// Delete
const commentDeleteCtrl = async(req, res) =>{
    try{
        res.json({
            status: "success",
            data: "delete comment route",
        });
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    commentCreateCtrl,
    commentSingleCtrl,
    commentsCtrl,
    commentUpdateCtrl,
    commentDeleteCtrl
}