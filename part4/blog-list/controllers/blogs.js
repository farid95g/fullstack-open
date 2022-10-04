const Blog = require('../models/blog')
const User = require('../models/user')

const getAllBlogs = async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
}

const createBlog = async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400)
            .json({ message: 'Please, include title and url for the blog!' })
    }

    if (!request.body.user) {
        return response.status(401).end()
    }

    const user = await User.findById(request.body.user)
    const blog = new Blog({
        ...request.body,
        likes: request.body.likes ?? 0
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    
    response.status(201).json(savedBlog)
}

const deleteBlog = async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
}

const updateBlog = async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
}

module.exports = {
    getAllBlogs,
    createBlog,
    deleteBlog,
    updateBlog
}