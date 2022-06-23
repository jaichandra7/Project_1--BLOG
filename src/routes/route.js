const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")
const MiddleWare = require('../middleWares/middleWare')

router.post('/authors',AuthorController.createAuthor)
router.post('/blogs',MiddleWare.authentication,BlogController.createBlog)
router.delete('/blogs/:_id',MiddleWare.authentication,MiddleWare. Authorization,BlogController.deleteblog1)
router.delete('/blogs/?',MiddleWare.authentication,MiddleWare. Authorization,BlogController.deleteblog2)
router.get('/blogs',MiddleWare.authentication,BlogController.getblogs)
router.put('/blogs/:_id',MiddleWare.authentication,MiddleWare. Authorization,BlogController.updateBlog)
router.post('/login',AuthorController.login)
// router.delete('/blogs/?',MiddleWare.authentication,MiddleWare. Authorization,BlogController.deleteblog3)

module.exports = router;
