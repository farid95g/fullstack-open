const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete) {
    await blogToDelete.deleteOne()
    return response.status(204).end()
  }

  response.status(404).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blogExists = await Blog.findById(request.params.id)

  if (!blogExists) {
    return response.status(404).end()
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter