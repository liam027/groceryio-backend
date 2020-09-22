const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

// INDEX
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('products')
  response.json(users)
})

// SHOW
usersRouter.get('/:id', async (request, response) => {
  const users = await User.findById(request.params.id)
  response.json(users)
})

// CREATE
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User( {
    username: body.username,
    email: body.email,
    created_at: new Date(),
    passwordHash: passwordHash
  })

  const savedUser = await user.save()

  delete savedUser.passwordHash
  response.json(savedUser)
})

module.exports = usersRouter
