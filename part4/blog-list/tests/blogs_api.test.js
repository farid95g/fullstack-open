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

    test('has 0 likes by default', async () => {
        const newBlogPostWithoutLikes = {
            title: 'Testing to add blog without likes',
            author: 'Stephen Hawking',
            url: 'https://www.facebook.com'
        }

        const savedBlogPost = await api
            .post('/api/blogs')
            .send(newBlogPostWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(savedBlogPost.body.likes).toBe(0)
    })

    test('without title and url cannot be created', async () => {
        const newBlogPostWithoutTitle = {
            author: 'Stephen Hawking',
            url: 'https://www.facebook.com'
        }
        const newBlogPostWithoutUrl = {
            title: 'New blog post without url',
            author: 'Stephen Hawking'
        }

        await api
            .post('/api/blogs')
            .send(newBlogPostWithoutTitle)
            .expect(400)
        await api
            .post('/api/blogs')
            .send(newBlogPostWithoutUrl)
            .expect(400)

        const dbBlogPosts = await testHelper.blogsInDb()
        expect(dbBlogPosts).toHaveLength(initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204, if id is valid', async () => {
        const blogsAtStart = await testHelper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await testHelper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('update of a blog', () => {
    test('succeeds with an existing id', async () => {
        const blogsAtStart = await testHelper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const body = {
            likes: 3,
            title: 'React is hard'
        }

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(body)
            .expect(200)

        expect(updatedBlog.body.likes).toEqual(3)

        const blogs = await testHelper.blogsInDb()
        const titles = blogs.map(blog => blog.title)
        expect(titles).toContain('React is hard')
    })
})

afterAll(() => {
    mongoose.connection.close()
})