const mongoose = require('mongoose');

//comment schema
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

//blog schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        // required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    comments: [commentSchema],

}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;