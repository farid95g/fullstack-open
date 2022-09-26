const Blog = require('../models/blog')

const getAllBlogs = async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
}

const createBlog = async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    
    response.status(201).json(savedBlog)
}

module.exports = {
    getAllBlogs,
    createBlog
}