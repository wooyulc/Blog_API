const express = require("express");
const userRouter = require("./routes/users/userRoutes");
const postRouter = require("./routes/posts/postRoutes");
const commentRouter = require("./routes/comments/commentRoutes");
const categoryRouter = require("./routes/categories/categoryRoutes");
const globalErrHandler = require("./middlewares/globalErrHandler");
const isAdmin = require("./middlewares/isAdmin");

require("dotenv").config();
require("./config/dbConnect");
const app = express();

// middelwares
// pass incoming passload 
app.use(express.json());

app.get('/', async (req,res)=>{
    try{
        const posts = await Post.find();
        res.json({
            status: "success",
            data: posts
        })
    } catch (error) {
        res.json(error);
    }
});

//app.use(isAdmin);

const userAuth = {
    isLogin: true,
};

app.use((req, res, next) => {
    if(userAuth.isLogin){
        next();
    } else{
        return res.json({
            msg: "Invlaid login credentials"
        });
    }
})

// routes
// users route
app.use('/api/v1/users', userRouter);
// posts route
app.use('/api/v1/posts', postRouter);
// comments route 
app.use('/api/v1/comments', commentRouter);
// category route
app.use('/api/v1/categories', categoryRouter)

// Error Handlers middlewares
app.use(globalErrHandler);

// 404 Error (not Found)
app.use('*', (req, res)=>{
    console.log(req.originalUrl);
    res.status(404).json({
        message: `${req.originalUrl} - Route Not Found`
    })
});
// listen to server
const PORT = 9000;

app.listen(PORT, console.log(`Server is up and running on ${PORT}`));