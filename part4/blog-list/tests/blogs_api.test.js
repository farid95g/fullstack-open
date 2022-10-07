const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const { initialBlogs, initialUsers } = require('./initialTestData')
const Blog = require('../models/blog')
const testHelper = require('./test_helpers')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    jest.setTimeout(75000)

    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345@As', 10)
    const initialUsersWithPassword = initialUsers
        .map(user => ({ ...user, passwordHash }))
    await User.insertMany(initialUsersWithPassword)

    const dbUsers = await testHelper.usersInDb()
    const blogs = initialBlogs.map((blog, i) => new Blog({
        ...blog, user: dbUsers[i].id
    }))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
})

describe('blog post', () => {
    const user = { ...initialUsers[0], password: '12345@As' }

    test('test db has 2 items', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const token = `bearer ${loggedInUser.body.token}`

        const response = await api
            .get('/api/blogs')
            .set({ Authorization: token })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(2)
    })

    test('has a property id', async () => {
        const blogs = await testHelper.blogsInDb()
        expect(blogs[0].id).toBeDefined()
    })

    test('cannot be created without token', async () => {
        const currentUser = (await testHelper.usersInDb())
            .find(u => u.username === user.username)

        const newBlogPost = {
            title: 'Blog without token',
            author: 'Stephen Hawking',
            url: 'https://www.facebook.com',
            user: currentUser.id
        }

        await api
            .post('/api/blogs')
            .send(newBlogPost)
            .expect(401)
    })

    test('is adding new item correctly', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const token = `bearer ${loggedInUser.body.token}`
        const currentUser = (await testHelper.usersInDb())
            .find(u => u.username === user.username)

        const newBlogPost = {
            title: 'Testing APIs',
            author: 'Albert Einstein',
            url: 'https://www.google.com',
            likes: 42,
            user: currentUser.id
        }
        
        await api
            .post('/api/blogs')
            .send(newBlogPost)
            .set({ Authorization: token })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await testHelper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).toContain('Testing APIs')
    })

    test('has 0 likes by default', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const token = `bearer ${loggedInUser.body.token}`
        const currentUser = (await testHelper.usersInDb())
            .find(u => u.username === user.username)

        const newBlogPostWithoutLikes = {
            title: 'Testing to add blog without likes',
            author: 'Stephen Hawking',
            url: 'https://www.facebook.com',
            user: currentUser.id
        }

        const savedBlogPost = await api
            .post('/api/blogs')
            .send(newBlogPostWithoutLikes)
            .set({ Authorization: token })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(savedBlogPost.body.likes).toBe(0)
    })

    test('without title and url cannot be created', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const token = `bearer ${loggedInUser.body.token}`
        const currentUser = (await testHelper.usersInDb())
            .find(u => u.username === user.username)

        const newBlogPostWithoutTitle = {
            author: 'Stephen Hawking',
            url: 'https://www.facebook.com',
            user: currentUser.id
        }
        const newBlogPostWithoutUrl = {
            title: 'New blog post without url',
            author: 'Stephen Hawking',
            user: currentUser.id
        }

        await api
            .post('/api/blogs')
            .send(newBlogPostWithoutTitle)
            .set({ Authorization: token })
            .expect(400)
        await api
            .post('/api/blogs')
            .send(newBlogPostWithoutUrl)
            .set({ Authorization: token })
            .expect(400)

        const dbBlogPosts = await testHelper.blogsInDb()
        expect(dbBlogPosts).toHaveLength(initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    const user = { ...initialUsers[0], password: '12345@As' }

    test('succeeds with status code 204, if id is valid', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const token = `bearer ${loggedInUser.body.token}`

        const blogsAtStart = await testHelper.blogsInDb()
        const blogToDelete = blogsAtStart[1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: token })
            .expect(204)

        const blogsAtEnd = await testHelper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('update of a blog', () => {
    const user = { ...initialUsers[0], password: '12345@As' }

    test('succeeds with an existing id', async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        const token = `bearer ${loggedInUser.body.token}`

        const blogsAtStart = await testHelper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const body = {
            likes: 3,
            title: 'React is hard'
        }

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(body)
            .set({ Authorization: token })
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