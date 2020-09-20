require('dotenv').config()
const { response } = require('express')
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const app = express();

// Import Models
const Product = require('./models/product')

// Define middleware
app.use(cors()) // TODO all origins currently accepted
app.use(express.json());
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
app.get('/api/products/:id', (request, response) => {
  Product.findById(request.params.id).then(product => {
    response.json(product)
  })
})


// CREATE
app.post('/api/products', (request, response) => {
  const content = request.body

  if (!content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const product = new Product({
    name: content.name,
    category: content.category || undefined,
    quantity: content.quantity,
    created_at: new Date()
  })

  product.save().then(savedProduct => {
    console.log("Added new product: ", product);
    response.json(savedProduct)
  })
})

// DESTROY
app.delete('/api/products/:id', (request, response) => {
  Product.deleteOne({ _id: request.params.id }, function(err, result) {
    if (err) {
      response.send(err);
    } else {
      response.send(result);
    }
  });
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const generateId = () => {
  const maxId = products.length > 0
    ? Math.max(...products.map(n => n.id))
    : 0
  return maxId + 1
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})