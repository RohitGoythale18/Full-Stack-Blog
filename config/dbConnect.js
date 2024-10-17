const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect('mongodb+srv://rohit1802:rohit1802@fullstackblog.gi0js.mongodb.net/fullstack-blog?retryWrites=true&w=majority&appName=FullStackBlog');
        console.log('Database Connected...!');
    } catch (error) {
        console.log('Database connection fail...!', error.message);
    }
};

dbConnect();