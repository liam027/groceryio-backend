const bcrypt = require('bcrypt')
const User = require('../models/user')
const Product = require('../models/product')
const usersRouter = require('express').Router()

// GET
usersRouter.get('/:id', async (request, response) => {
  const user_id = request.params.id

  const products = await Product
    .find({user: user_id})

  response.json(products)
})

// CREATE
usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User( {
    username: body.username,
    passwordHash: passwordHash,
    created_at: new Date()
  })

  const savedUser = await user.save()

  delete savedUser.passwordHash
  response.json(savedUser)
})

module.exports = usersRouter
