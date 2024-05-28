const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1, name: 1, id: 1
    })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const blog = new Blog({
    ...request.body, user: user?.id || null
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(404).end()
  }

  if (user.id.toString() !== blogToDelete.user.toString()) {
    return response.status(401).json({
      message: 'You must be the author of blog for deleting it!'
    })
  }

  await blogToDelete.deleteOne()
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const user = request.user
  const blogExists = await Blog.findById(request.params.id)

  if (!blogExists) {
    return response.status(404).end()
  }

  if (user.id.toString() !== blogExists.user?.toString()) {
    return response.status(401).json({
      message: 'You must be the author of blog for editing it!'
    })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter