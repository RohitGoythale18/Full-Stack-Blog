const express = require("express");
const { createCommentCtrl, fetchCommentCtrl, updateCommentCtrl, deleteCommentCtrl } = require("../../controllers/comments/Comments");
const commentRoutes = express.Router();
const protected = require("../../middlewares/protected");
//Comments routes
//---------------------
//Create comment
commentRoutes.post('/:id', protected, createCommentCtrl);

//Fetch single comment
commentRoutes.get('/:id', fetchCommentCtrl);

//Update comment
commentRoutes.put('/:id', protected, updateCommentCtrl);

//Delete comment
commentRoutes.delete('/:id', protected, deleteCommentCtrl);

module.exports = commentRoutes;