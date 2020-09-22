const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const productsRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
}

// INDEX
productsRouter.get('/', async (request, response) => {
  const products = await Product
    .find({})
    .populate('user', { username: 1, email: 1 })

  response.json(products)
})

// SHOW
productsRouter.get('/:id', async (request, response) => {
  const product = await Product.findById(request.params.id)
  if (product) {
    response.json(product)
  }
  else {
    response.status(404).end()
  }
})


// CREATE
productsRouter.post('/', async (request, response) => {
  const content = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  // Save new product
  const product = new Product({
    name: content.name,
    category: content.category || undefined,
    quantity: content.quantity,
    created_at: new Date(),
    user: user._id
  })
  const savedProduct = await product.save()

  // Save new product ID to user's products
  user.products = user.products.concat(savedProduct._id)
  await user.save()

  response.json(savedProduct)
})

// UPDATE
productsRouter.put('/:id', async (request, response) => {
  const content = request.body

  const product = {
    name: content.name,
    category: content.category,
    quantity: content.quantity
  }

  // enable validations during update, Mongoose default is OFF
  const opts = { runValidators: true, new: true, context: 'query' }
  const result = await Product.findByIdAndUpdate(request.params.id, product, opts)
  logger.info('Record successfully updated. ID: ', result)
  response.json(result)
})

// DESTROY
productsRouter.delete('/:id', async (request, response) => {
  await Product.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = productsRouter