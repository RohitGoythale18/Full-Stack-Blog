const express = require("express");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const { createPostCtrl, fetchAllPostCtrl, fetchSinglePostCtrl, updatePostCtrl, deletePostCtrl } = require("../../controllers/posts/Posts");
const postRoutes = express.Router();
const protected = require("../../middlewares/protected");

//Instance of multer
const upload = multer({ storage });

//Posts routes
//---------------------
//Create post
postRoutes.post('/create-post', protected, upload.single('post'), createPostCtrl);

//Fetch post
postRoutes.get('/all-post', fetchAllPostCtrl);

//Fetch single post
postRoutes.get('/:id', fetchSinglePostCtrl);

//Update post
postRoutes.put('/update-post/:id', protected, upload.single('post'), updatePostCtrl);

//Delete post
postRoutes.delete('/:id', protected, deletePostCtrl);

module.exports = postRoutes;