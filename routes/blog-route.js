const express = require('express');
const { createBlog, editBlog, addComment, deleteComment, getAllBlogs, getBlog, getAllComments, deleteBlog } = require('../controllers/blog-controller');
const { isAuth, adminOnly } = require('../middlewares/authmiddleware');
const { upload } = require('../utils/imageUpload');

const router = express.Router();

//admin only
router.post('/create', isAuth, adminOnly, upload.single('image'), createBlog);
router.put('/edit/:id', isAuth, adminOnly, upload.single('image'), editBlog);
router.delete('/delete/:id', isAuth, adminOnly, deleteBlog);

router.post('/comment/:id', isAuth, addComment);
router.delete('/comment/:id', isAuth, deleteComment);
router.get('/comment', isAuth, getAllComments);
router.get('/blogs', isAuth, getAllBlogs);
router.get('/blog/:id', isAuth, getBlog)

module.exports = router;