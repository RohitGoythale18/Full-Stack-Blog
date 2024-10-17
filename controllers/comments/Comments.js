const Users = require("../../models/users/Users");
const Posts = require("../../models/posts/Posts");
const Comments = require("../../models/comments/Comments");
const appErr = require("../../utils/AppErr");

const createCommentCtrl = async (req, res) => {
    const { message } = req.body;
    try {
        //Find the post
        const post = await Posts.findById(req.params.id);
        //Create the comment
        const comment = await Comments.create({
            user: req.session.userAuth,
            message,
        });
        //Push the comment to post
        post.comments.push(comment._id);
        //Find the user
        const user = await Users.findById(req.session.userAuth);
        //Push the comment into
        user.comments.push(comment._id);
        // Disable Validation & Save
        await post.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });
        res.json({
            status: 'success',
            data: comment,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const fetchCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            user: 'Comment details...!',
        });
    } catch (error) {
        res.json(error.message);
    }
};

const updateCommentCtrl = async (req, res, next) => {
    const { message } = req.body;
    try {
        //Find the comment
        const comment = await Comments.findById(req.params.id);
        //Check the comment is already exists
        if(!comment){
            return next(appErr('Comment not found...!'));
        }
        //Check if the post belongs to the user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to update this comment...!', 403));
        }
        //Update a comment
        const updateComment = await Comments.findByIdAndUpdate(req.params.id, {
            message,
        }, {
            new: true,
        });
        res.json({
            status: 'success',
            data: updateComment,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const deleteCommentCtrl = async (req, res) => {
    try {
        //Find the comment
        const comment = await Comments.findById(req.params.id);
        //Check if the post belongs to the user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to delete this comment...!', 403));
        }
        //Delete comment
        await Comments.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'Comment deleted...!',
        });
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    createCommentCtrl,
    fetchCommentCtrl,
    updateCommentCtrl,
    deleteCommentCtrl,
}