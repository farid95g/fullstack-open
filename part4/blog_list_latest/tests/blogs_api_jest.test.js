const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = await api.post('/api/users').send(helper.initialUsers[0])

  await Blog.deleteMany({})
  await Blog.insertMany(
    helper.initialBlogs.map(b => ({ ...b, user: user.body.id }))
  )
})

describe('getting all blogs', () => {
  const user = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  test('are returned in json format with correct quantity', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toEqual(helper.initialBlogs.length)
  })

  test('are returned with id property instead of _id', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const firstBlog = response.body[0]
    expect(firstBlog.id).toBeDefined()
  })
})

describe('creating a new blog post', () => {
  const user = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  test('is successfull with valid data', async () => {
    const newBlog = {
      title: 'Test adding new blog post',
      author: 'Author for testing',
      url: 'https://www.youtube.com',
      likes: 0
    }

    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
    const contents = blogsAtEnd.body.map(b => b.content)

    expect(blogsAtEnd.body.length).toEqual(helper.initialBlogs.length + 1)
    expect(contents).toContain(response.body.content)
  })

  test('without likes property makes it default to 0', async () => {
    const newBlog = {
      title: 'Test adding new blog post',
      author: 'Author for testing',
      url: 'https://www.youtube.com'
    }

    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toEqual(0)
  })

  test('without title or url gets error with status code 400', async () => {
    const firstInvalidBlog = {
      author: 'Author for testing',
      url: 'https://www.youtube.com',
    }
    const secondInvalidBlog = {
      title: 'Test adding new blog post',
      author: 'Author for testing',
    }

    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(firstInvalidBlog)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(secondInvalidBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  const user = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  test('succeeds with valid id', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 404 if id is valid and does not exist', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const nonExistingId = await helper.getNonExistingId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const invalidId = '123456789'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length)
  })
})

describe('update of a blog', () => {
  const user = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }

  test('succeeds with valid id and data', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0]
    const updatedLikesQuantity = { likes: 1608 }

    const response = await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(updatedLikesQuantity)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(updatedLikesQuantity.likes)
  })

  test('fails with status code 401 if user is not author of blog', async () => {
    const loggedInUser = await api.post('/api/login').send({
      username: helper.initialUsers[1].username,
      password: helper.initialUsers[1].password,
    })
    const { token } = loggedInUser.body

    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0]
    const updatedLikesQuantity = { likes: 1608 }

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(updatedLikesQuantity)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(firstBlog.likes).toEqual(blogsAtEnd[0].likes)
  })

  test('fails with status code 404 if id valid and does not exist', async () => {
    const loggedInUser = await api.post('/api/login').send(user)
    const { token } = loggedInUser.body

    const nonExistingId = await helper.getNonExistingId()
    const updatedLikesQuantity = { likes: 1608 }

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(updatedLikesQuantity)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})