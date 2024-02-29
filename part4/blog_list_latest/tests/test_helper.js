const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test blog 1',
    author: 'Test author 1',
    url: 'https://www.google.com',
    likes: 12
  },
  {
    title: 'Test blog 2',
    author: 'Test author 2',
    url: 'https://www.google.com',
    likes: 45
  }
]

const getNonExistingId = async () => {
  const newBlog = new Blog({
    title: 'This blog will be removed soon',
    url: 'https://www.test.com'
  })

  await newBlog.save()
  await newBlog.deleteOne()

  return newBlog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog)
}

module.exports = {
  initialBlogs, blogsInDb, getNonExistingId
}