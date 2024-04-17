const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  const user = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  beforeEach(async () => {
    await User.deleteMany({})
    const user = await api.post('/api/users').send(helper.initialUsers[0])

    await Blog.deleteMany({})
    await Blog.insertMany(
      helper.initialBlogs.map(b => ({ ...b, user: user.body.id }))
    )
  })

  describe('getting all blogs', () => {
    test('are returned as a JSON', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('are returned fully', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)

      assert.strictEqual(
        response.body.length, helper.initialBlogs.length
      )
    })
  })

  test('the unique identifier of blogs is called id', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
    const dbBlog = await Blog.findOne({})

    assert.strictEqual(
      response.body[0].id, dbBlog._id.toString()
    )
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Test adding new blog post',
        author: 'Author for testing',
        url: 'https://www.youtube.com',
        likes: 0
      }

      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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

    test('with missing likes property defaults to zero', async () => {
      const newBlog = {
        title: 'Missing like property',
        author: 'Author for testing',
        url: 'https://www.youtube.com'
      }

      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

      assert.strictEqual(response.body.likes, 0)
    })

    test('without title or url cannot be added', async () => {
      const newBlog = {
        author: 'Author for testing'
      }

      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('without authorization token fails with status code 401', async () => {
      const newBlog = {
        title: 'Missing like property',
        author: 'Author for testing',
        url: 'https://www.youtube.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      assert(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    const user = helper.initialUsers[0]

    test('succeeds with valid id', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const blogAtStart = await helper.blogsInDb()
      const blogToDelete = blogAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with non-existing id', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const nonExistingId = await helper.getNonExistingId()

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(
        blogsAtEnd.length, helper.initialBlogs.length
      )
    })

    test('fails with invalid id', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const invalidId = 'invalidMongoDbId'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(
        blogsAtEnd.length, helper.initialBlogs.length
      )
    })
  })

  describe('update of a blog', () => {
    const user = helper.initialUsers[0]

    test('with valid id succeeds', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const blogsAtStart = await helper.blogsInDb()
      const firstBlog = blogsAtStart[0]

      const updatedBlogInfo = { likes: 13 }

      await api
        .put(`/api/blogs/${firstBlog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlogInfo)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === firstBlog.id)

      assert.strictEqual(updatedBlog.likes, updatedBlogInfo.likes)
    })

    test('with non-existing id returns 404', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      const nonExistingId = await helper.getNonExistingId()

      const updatedBlogInfo = { likes: 16 }

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlogInfo)
        .expect(404)
    })

    test('with invalid id fails with status code 400', async () => {
      const loggedInUser = await api.post('/api/login').send(user)
      const { token } = loggedInUser.body

      await api
        .put('/api/blogs/invalidMongoDbId')
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: 99 })
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
