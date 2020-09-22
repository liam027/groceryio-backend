const app = require('../../app')
const bcrypt = require('bcrypt')
const helper = require('../test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', email: 'root@root.com', passwordHash })

    await user.save()
  })

})



afterAll(() => {
  mongoose.connection.close()
})