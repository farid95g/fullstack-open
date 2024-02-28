const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
})

test('blogs are returned as a JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length, helper.initialBlogs.length
  )
})

test('the unique identifier of blogs is called id', async () => {
  const response = await api.get('/api/blogs')
  const dbBlog = await Blog.findOne({})

  assert.strictEqual(
    response.body[0].id, dbBlog._id.toString()
  )
})

test('a valid blog can be added successfully', async () => {
  const newBlog = {
    title: 'Test adding new blog post',
    author: 'Author for testing',
    url: 'https://www.youtube.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(
    blogsAtEnd.length, helper.initialBlogs.length + 1
  )

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes(newBlog.title))
})

test('missing likes property defaults to zero', async () => {
  const newBlog = {
    title: 'Missing like property',
    author: 'Author for testing',
    url: 'https://www.youtube.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title or url cannot be added', async () => {
  const newBlog = {
    author: 'Author for testing'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
