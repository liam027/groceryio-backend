require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./errorHandler')
const endpointHandler = require('./endpointHandler')

const app = express()

// Import Models
const Product = require('./models/product')

// Define middleware
app.use(cors()) // TODO all origins currently accepted
app.use(express.json())
app.use(express.static('build')) // serve static files
app.use(morgan('tiny')) // log all actions



// Routes
// INDEX
app.get('/api/products', (request, response) => {
  Product.find({}).then(products => {
    response.json(products)
  })
})

// SHOW
app.get('/api/products/:id', (request, response, next) => {
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
app.post('/api/products', (request, response, next) => {
  const content = request.body

  const product = new Product({
    name: content.name,
    category: content.category || undefined,
    quantity: content.quantity,
    created_at: new Date()
  })

  product.save()
    .then(savedProduct => {
      console.log('Added new product: ', product)
      return savedProduct.toJSON()
    })
    .then(savedAndFormattedProduct => {
      response.json(savedAndFormattedProduct)
    })
    .catch(error => next(error))
})

// UPDATE
app.put('/api/products/:id', (request, response, next) => {
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
      console.log('Record successfully updated. ID: ', result)
      response.json(result)
    })
    .catch(error => next(error))
})

// DESTROY
app.delete('/api/products/:id', (request, response, next) => {
  Product.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(endpointHandler)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})