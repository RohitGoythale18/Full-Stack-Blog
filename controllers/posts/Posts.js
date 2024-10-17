const Posts = require("../../models/posts/Posts");
const Users = require("../../models/users/Users");
const appErr = require("../../utils/AppErr");

const createPostCtrl = async (req, res, next) => {
    const { title, description, category, user, image } = req.body;

    try {
        if (!title || !description || !category || !req.body) {
            return next(appErr('All fields are required...!'))
        }
        //Find user
        const user = req.session.userAuth;
        const userFound = await Users.findById(user);
        //Create post
        const createPost = await Posts.create({
            title,
            description,
            category,
            user: userFound._id,
            image: req.file.path,
        });
        //Push the post created into the array of users post
        userFound.posts.push(createPost._id);
        //Resave
        await userFound.save();

        res.json({
            status: 'success',
            data: createPost,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const fetchAllPostCtrl = async (req, res, next) => {
    try {
        const allPosts = await Posts.find().populate('comments');
        res.json({
            status: 'success',
            data: allPosts,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const fetchSinglePostCtrl = async (req, res, next) => {
    try {
        //Get the id from params
        const postID = req.params.id;
        //Find the post
        const post = await Posts.findById(postID).populate('comments');
        res.json({
            status: 'success',
            data: post,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const updatePostCtrl = async (req, res, next) => {
    const { title, description, category, image } = req.body;
    try {
        //Find the post
        const post = await Posts.findById(req.params.id);
        //Check if the post belongs to the user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to update this post...!', 403));
        }
        //Update a post
        const updatePost = await Posts.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            image: req.file.path,
        }, {
            new: true,
        });
        res.json({
            status: 'success',
            data: updatePost,
        });
    } catch (error) {
        res.json(error.message);
    }
};

const deletePostCtrl = async (req, res, next) => {
    try {
        //Find the post
        const post = await Posts.findById(req.params.id);
        //Check if the post belongs to the user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to delete this post...!', 403));
        }
        //Delete post
        await Posts.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'Post deleted...!',
        });
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    createPostCtrl,
    fetchAllPostCtrl,
    fetchSinglePostCtrl,
    updatePostCtrl,
    deletePostCtrl,
};