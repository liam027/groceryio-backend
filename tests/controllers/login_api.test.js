const app = require('../../app')
const helper = require('../test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = helper.initialUsers
    .map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('user login', () => {

  test('a user with valid credentials can log in', async () => {
    const testCredentials = {
      username: 'root',
      password: 'password'
    }

    const response = await api
      .post('/api/login')
      .send(testCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('token')
  })

  test('user not found displays error message', async () => {
    const testCredentials = {
      username: 'bungo',
      password: 'password'
    }

    const response = await api
      .post('/api/login')
      .send(testCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })

  test('incorrect password displays error message', async () => {
    const testCredentials = {
      username: 'root',
      password: 'badpassword'
    }

    const response = await api
      .post('/api/login')
      .send(testCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('invalid username or password')
  })

})

afterAll(() => {
  mongoose.connection.close()
})