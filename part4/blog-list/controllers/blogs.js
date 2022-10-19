const Blog = require('../models/blog')
const User = require('../models/user')

const getAllBlogs = async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 })
    response.json(blogs)
}

const createBlog = async (request, response) => {
    const creator = request.user
    if (!creator.id || creator.id !== request.body.user) {
        return response.status(401).json({ error: 'Missing or invalid token' })
    }

    if (!request.body.title || !request.body.url) {
        return response.status(400)
            .json({ message: 'Please, include title and url for the blog!' })
    }

    if (!request.body.user) {
        return response.status(401).end()
    }

    const user = await User.findById(creator.id)
    const blog = new Blog({
        ...request.body,
        likes: request.body.likes ?? 0,
        user: user.id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    
    response.status(201).json(savedBlog)
}

const deleteBlog = async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({
            message: `Blog with id ${request.params.id} does not exist!`
        })
    }

    const creator = request.user
    if (creator.id.toString() !== blog.user.toString()) {
        return response.status(401).json({
            message: 'You must be the author to delete the blog!'
        })
    }

    await blog.remove()
    response.status(204).end()
}

const updateBlog = async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { blogs: 0 })
    response.json(updatedBlog)
}

module.exports = {
    getAllBlogs,
    createBlog,
    deleteBlog,
    updateBlog
}