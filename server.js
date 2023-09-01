const express = require("express");
const userRouter = require("./routes/users/userRoutes");
const postRouter = require("./routes/posts/postRoutes");
const commentRouter = require("./routes/comments/commentRoutes");
const categoryRouter = require("./routes/categories/categoryRoutes");
require("dotenv").config();
require("./config/dbConnect");
const app = express();

// middelwares
// pass incoming passload 
app.use(express.json());

const userAuth = {
    isLogin: true,
    isAdmin: false,
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

// listen to server
const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server is up and running on ${PORT}`));