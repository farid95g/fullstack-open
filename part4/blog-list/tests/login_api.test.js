const mongoose = require('mongoose')
const supertest = require('supertest')
const  bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const { initialUsers } = require('./initialTestData')

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

describe('login', () => {
    test('succeeds with proper username and password', async () => {
        const user = { ...initialUsers[0], password: '12345@As' }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const keys = Object.keys(response.body)

        expect(keys).toContain('token')
        expect(keys).toHaveLength(3)
    })

    test('fails with wrong password', async () => {
        const user = { ...initialUsers[0], password: '12345' }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(Object.keys(response.body))
            .toContain('message')
    })
})

afterAll(() => {
    mongoose.connection.close()
})