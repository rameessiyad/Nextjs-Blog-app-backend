const Blog = require('../models/blog-model');
const asyncHandler = require('express-async-handler');
const { getFileUrl } = require('../utils/imageUpload');

module.exports = {
    //create a blog (admin only)
    createBlog: asyncHandler(async (req, res) => {
        const { title, content } = req.body;

        if (!title || !content) {
            res.status(400);
            throw new Error('All fields are required');
        };

        //image upload
        const imageUrl = req.file ? getFileUrl(req, req.file) : '';

        const blog = await Blog.create({
            title,
            content,
            image: imageUrl,
            author: req.user._id
        });

        res.status(201).json({
            success: true,
            successMessage: "Blog created successfully",
        })
    }),

    //update a blog (admin only)
    editBlog: asyncHandler(async (req, res) => {
        const { title, content } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        if (blog.author.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        };

        const imageUrl = req.file ? getFileUrl(req, req.file) : blog.image;

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.image = imageUrl;

        await blog.save();

        res.status(200).json({
            message: 'Blog updated successfully',
        })
    }),

    //delete a blog (admin only)
    deleteBlog: asyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        if (blog.author.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        };

        const deleteABlog = await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Blog deleted successfully',
        })
    }),

    //find a blog by id
    getBlog: asyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        res.json({ data: blog });
    }),

    //get all blogs
    getAllBlogs: asyncHandler(async (req, res) => {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });

        if (!blogs) {
            res.status(404);
            throw new Error('No blogs found');
        };

        res.json({ data: blogs });
    }),

    //get top 3 blos
    getTopBlogs: asyncHandler(async (req, res) => {
        const blogs = await Blog.find({}).sort({ views: -1 }).limit(3);

        if (!blogs) {
            res.status(404);
            throw new Error('No blogs found');
        };

        res.json({ data: blogs });
    }),

    //total blogs count
    getBlogsCount: asyncHandler(async (req, res) => {
        const count = await Blog.countDocuments();
        res.json({ data: count });
    }),

    //add a comment
    addComment: asyncHandler(async (req, res) => {
        const { content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        const comment = {
            user: req.user._id,
            content: content
        }

        blog.comments.push(comment);
        await blog.save();

        res.status(201).json({
            message: "Comment added",
            data: comment
        })
    }),

    //delete a comment
    deleteComment: asyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            res.status(404);
            throw new Error('Comment not found');
        };

        blog.comments.splice(commentIndex, 1);
        await blog.save();

        res.status(200).json({
            message: 'Comment deleted'
        })
    }),

    //get all comments
    getAllComments: asyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        res.json({ data: blog.comments });
    }),

    //get comment of a blog
    getComments: asyncHandler(async (req, res) => {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found');
        };

        const comments = blog.comments.filter(comment => comment.user.toString() === req.params.commentId);
        res.json({ data: comments });
    }),

    //get total comments count 
    getCommentsCount: asyncHandler(async (req, res) => {
        const totalCommentsCount = await Blog.aggregate([
            {
                $unwind: '$comments'
            },
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 }
                }
            }
        ])
        // If there are no comments, set totalComments to 0
        const totalCount = totalCommentsCount.length > 0 ? totalCommentsCount[0].totalComments : 0;

        return res.status(200).json({
            success: true,
            totalComments: totalCount
        })
    })

}