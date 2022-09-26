const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs } = require('./initialTestData')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = initialBlogs.map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
})

test('blogs test db has 2 blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(2)
})

afterAll(() => {
    mongoose.connection.close()
})