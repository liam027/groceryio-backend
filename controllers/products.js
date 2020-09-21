const productsRouter = require('express').Router()
const Product = require('../models/product')
const logger = require('../utils/logger')

// INDEX
productsRouter.get('/', async (request, response) => {
  const products = await Product.find({})
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

  const product = new Product({
    name: content.name,
    category: content.category || undefined,
    quantity: content.quantity,
    created_at: new Date()
  })

  const savedProduct = await product.save()
  response.json(savedProduct)
})

// UPDATE
productsRouter.put('/:id', async (request, response) => {
  const content = request.body

  const note = {
    name: content.name,
    category: content.category,
    quantity: content.quantity
  }

  // enable validations during update, Mongoose default is OFF
  const opts = { runValidators: true, new: true, context: 'query' }
  const result = await Product.findByIdAndUpdate(request.params.id, note, opts)
  logger.info('Record successfully updated. ID: ', result)
  response.json(result)
})

// DESTROY
productsRouter.delete('/:id', async (request, response) => {
  await Product.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = productsRouter