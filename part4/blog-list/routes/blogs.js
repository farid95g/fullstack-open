const express = require('express')
const blogsController = require('../controllers/blogs')

const blogsRouter = express.Router()

blogsRouter
    .route('/')
    .get(blogsController.getAllBlogs)
    .post(blogsController.createBlog)

blogsRouter
    .route('/:id')
    .delete(blogsController.deleteBlog)
    .put(blogsController.updateBlog)

module.exports = blogsRouter