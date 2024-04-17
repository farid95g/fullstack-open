const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  describe('getting all users', () => {
    test('are returned as JSON', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('are returned fully', async () => {
      const response = await api.get('/api/users')

      assert.strictEqual(
        response.body.length, helper.initialUsers.length
      )
    })
  })

  describe('creating new user', () => {
    test('without username fails with proper status code and message', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Farid',
        password: '123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.message.includes('Path `username` is required'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test(
      'with existing username fails with proper status code and message',
      async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: helper.initialUsers[0].username,
          name: 'Farid',
          password: '123'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.message.includes('Expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      }
    )

    test(
      'with username length less than 3 fails with proper status code and error message',
      async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'aa',
          name: 'Farid',
          password: '123'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.message.includes('is shorter than the minimum allowed length (3)'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      }
    )

    test(
      'with password length less than 3 fails with proper status code and error message',
      async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Super user',
          password: '12'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.message.includes('Password must have at least 3 characters'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      }
    )

    test(
      'without password fails with proper status code and error message',
      async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Super user'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.message.includes('Please, provide password for newly created user'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      }
    )
  })
})

after(async () => {
  await mongoose.connection.close()
})