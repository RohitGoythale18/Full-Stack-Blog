require("dotenv").config();
require("./config/dbConnect");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/user");
const postRoutes = require("./routes/posts/post");
const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middlewares/globalHandler");
const app = express();

//middlewares
app.use(express.json()); //Pass incoming data

//session configuration
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl: 24 * 60 * 60, //1 day
    }),
}));

//User routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

//error handlers middlewares
app.use(globalErrHandler);

//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});