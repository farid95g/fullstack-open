const Blog = require('../models/blog')

const getAllBlogs = async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
}

const createBlog = async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400)
            .json({ message: 'Please, include title and url for the blog!' })
    }

    const blog = new Blog({
        ...request.body,
        likes: request.body.likes ?? 0
    })
    const savedBlog = await blog.save()
    
    response.status(201).json(savedBlog)
}

module.exports = {
    getAllBlogs,
    createBlog
}