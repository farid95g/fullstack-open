const Blog = require('../models/blog')

const getAllBlogs = async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
}

const createBlog = (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
}

module.exports = {
    getAllBlogs,
    createBlog
}