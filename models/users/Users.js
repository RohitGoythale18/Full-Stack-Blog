const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
}, {
    timestamps: true,
});

//Model
const Users = new mongoose.model('Users', userSchema);

module.exports = Users;