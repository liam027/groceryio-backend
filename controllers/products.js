const productsRouter = require('express').Router()
const Product = require('../models/product')
const logger = require('../utils/logger')

// INDEX
productsRouter.get('/', async (request, response) => {
  const products = await Product.find({})
  response.json(products)
})

// SHOW
productsRouter.get('/:id', async (request, response, next) => {
  Product.findById(request.params.id)
    .then(product => {
      if (product) {
        response.json(product)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => { next(error) })
})


// CREATE
productsRouter.post('/', async (request, response, next) => {
  const content = request.body

  const product = new Product({
    name: content.name,
    category: content.category || undefined,
    quantity: content.quantity,
    created_at: new Date()
  })

  product.save()
    .then(savedProduct => {
      logger.info('Added new product: ', product)
      return savedProduct.toJSON()
    })
    .then(savedAndFormattedProduct => {
      response.json(savedAndFormattedProduct)
    })
    .catch(error => next(error))
})

// UPDATE
productsRouter.put('/:id', async (request, response, next) => {
  const content = request.body

  const note = {
    name: content.name,
    category: content.category,
    quantity: content.quantity
  }

  // enable validations during update, Mongoose default is OFF
  const opts = { runValidators: true, new: true, context: 'query' }
  Product.findByIdAndUpdate(request.params.id, note, opts)
    .then(result => {
      logger.info('Record successfully updated. ID: ', result)
      response.json(result)
    })
    .catch(error => next(error))
})

// DESTROY
productsRouter.delete('/:id', async (request, response, next) => {
  Product.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = productsRouter