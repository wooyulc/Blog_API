const mongoose = require('mongoose');

//function to connect
const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected Successfully")
    } catch(error) {
        console.log("DB failed");
        process.exit(1);
    }
}

dbConnect();