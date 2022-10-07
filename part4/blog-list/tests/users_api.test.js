const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const { initialUsers } = require('./initialTestData')
const User = require('../models/user')
const testHelper = require('./test_helpers')

const api = supertest(app)

beforeEach(async () => {
    jest.setTimeout(75000)

    const passwordHash = await bcrypt.hash('12345@As', 10)
    const initialUsersWithPassword = initialUsers.map(user => ({
        ...user,
        passwordHash
    }))
    await User.deleteMany({})
    await User.insertMany(initialUsersWithPassword)
})

describe('user', () => {
    test('list returns all users', async () => {
        const user = { ...initialUsers[0], password: '12345@As' }
        const loginResponse = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .get('/api/users')
            .set({ Authorization: `bearer ${loginResponse.body.token}` })
            .expect(200)

        expect(response.body).toHaveLength(2)
    })

    test('is not created if username or password is not included', async () => {
        const usersAtStart = await testHelper.usersInDb()

        const userWithoutUsername = {
            name: 'New Farid',
            password: '123456'
        }
        const userWithoutPassword = {
            username: 'farid95g',
            name: 'New Farid'
        }

        await api
            .post('/api/users')
            .send(userWithoutUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(userWithoutPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await testHelper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is not created if username or password is less than 3 characters', async () => {
        const usersAtStart = await testHelper.usersInDb()

        const userWithShortUsername = {
            username: 'ab',
            name: 'New Farid',
            password: '123456'
        }
        const userWithShortPassword = {
            username: 'farid95',
            name: 'New Farid',
            password: '12'
        }

        await api
            .post('/api/users')
            .send(userWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        await api
            .post('/api/users')
            .send(userWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await testHelper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('is not created with the same username', async () => {
        const usersAtStart = await testHelper.usersInDb()

        const newUser = {
            username: 'farid95g',
            name: 'New Farid',
            password: '123456'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await testHelper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => mongoose.connection.close())