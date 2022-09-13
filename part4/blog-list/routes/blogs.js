const express = require('express')
const blogsController = require('../controllers/blogs')

const blogsRouter = express.Router()

blogsRouter
    .route('/')
    .get(blogsController.getAllBlogs)
    .post(blogsController.createBlog)

module.exports = blogsRouter