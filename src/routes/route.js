const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")

router.post('/authors',AuthorController.createAuthor)
router.post('/blogs',BlogController.createBlog)
router.delete('/blogs/:_id',BlogController.deleteblog1)
router.delete('/blogs?',BlogController.deleteblog2)
router.get('/blogs',BlogController.getblogs)
router.put('/blogs/:_id',BlogController.updateBlog)


module.exports = router;
