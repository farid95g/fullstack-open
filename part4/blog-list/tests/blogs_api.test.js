const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs } = require('./initialTestData')
const Blog = require('../models/blog')
const testHelper = require('./test_helpers')

const api = supertest(app)

beforeEach(async () => {
    jest.setTimeout(75000)

    await Blog.deleteMany({})

    const blogs = initialBlogs.map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
})

describe('blog post', () => {
    test('test db has 2 items', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(2)
    })

    test('has a property id', async () => {
        const blogs = await testHelper.blogsInDb()
        expect(blogs[0].id).toBeDefined()
    })

    test('is adding new item correctly', async () => {
        const newBlogPost = {
            title: 'Testing APIs',
            author: 'Albert Einstein',
            url: 'https://www.google.com',
            likes: 42
        }

        await api
            .post('/api/blogs')
            .send(newBlogPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await testHelper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).toContain('Testing APIs')
    })
})

afterAll(() => {
    mongoose.connection.close()
})