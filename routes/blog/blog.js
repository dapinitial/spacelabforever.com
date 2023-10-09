const express = require('express');
const blogController = require('../../controllers/blogController');
const router = express.Router();

// Define your routes
router.get('/posts', blogController.getAllBlogPosts);
router.get('/posts/:id', blogController.getSingleBlogPost);
router.post('/posts', blogController.createBlogPost);

module.exports = router;
