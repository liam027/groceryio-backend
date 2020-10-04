const testingRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Product.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter