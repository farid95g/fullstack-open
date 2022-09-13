const Blog = require('../models/blog')

const getAllBlogs = (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
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