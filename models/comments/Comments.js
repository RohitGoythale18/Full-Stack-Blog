const mongoose = require("mongoose");

//Schema
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User',
    },
    message: {
        type: String,
        require: true,
    },
}, {
    timestamps: true,
});

//Model
const Comments = new mongoose.model('Comments', commentSchema);

module.exports = Comments;