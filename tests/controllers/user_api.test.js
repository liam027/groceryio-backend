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

describe('creating a new user', () => {

  test('a valid user can be created', async () => {
    const testUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(testUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // User has been added
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

    // The new user information is present
    const contents = usersAtEnd.map(user => user.username)
    expect(contents).toContain('testuser')
  })

  test('duplicate usernames are not permitted', async () => {
    const testUser = {
      username: 'root',
      email: 'test@test.com',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(testUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')
    // No user has been added
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)

  })

  test('duplicate emails are not permitted', async () => {
    const testUser = {
      username: 'testuser',
      email: 'root@root.com',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(testUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`email` to be unique')
    // No user has been added
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})