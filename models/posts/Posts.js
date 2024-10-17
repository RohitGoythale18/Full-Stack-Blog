const mongoose = require("mongoose");

//Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["ReactJS", "NodeJS", "MongoDB", "ExpressJS"],
    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
}, {
    timestamps: true,
});

//Model
const Posts = new mongoose.model('Posts', postSchema);

module.exports = Posts;