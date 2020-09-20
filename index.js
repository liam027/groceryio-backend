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
  const id = Number(request.params.id);
  const product = products.find(product => product.id === id);
  if (product) {
    response.json(product)
  } else {
    response.status(404).end()
  }
})

// CREATE
app.post('/api/products', (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const product = {
    id: generateId(),
    name: body.name,
    category: body.category || undefined,
    quantity: body.quantity,
    created_at: new Date()
  }

  products = products.concat(product)

  console.log("Added new product: ", product);

  response.json(product)
})

// DESTROY
app.delete('/api/products/:id', (request, response) => {
  const id = Number(request.params.id)
  products = products.filter(product => product.id !== id)
  console.log("Deleted product with ID: ", id);
  response.status(204).end()
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