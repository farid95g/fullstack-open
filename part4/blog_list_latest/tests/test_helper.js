const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'root',
    name: 'Root user',
    password: '12345@As'
  },
  {
    username: 'faridfg',
    name: 'Farid Guluzade',
    password: '12345@As'
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

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb, getNonExistingId, usersInDb
}