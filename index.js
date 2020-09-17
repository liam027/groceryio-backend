const { response } = require('express')
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const app = express();

// Define middleware
app.use(cors())
app.use(express.json());
app.use(morgan('tiny'))

let products = [
    {
      "id": 1,
      "name": "turkey",
      "category": "produce",
      "quantity": 0,
    },
    {
      "id": 2,
      "name": "rice",
      "category": "produce",
      "quantity": 0
    },
    {
      "id": 3,
      "name": "vinegar",
      "category": "produce",
      "quantity": 0
    }
  ]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
})

app.get('/api/products', (req, res) => {
  res.json(products);
})

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(product => product.id === id);
  if (product) {
    res.json(product)
  } else {
    res.status(404).end()
  }
})

app.post('/api/products', (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
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

  res.json(product)
})

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id)
  products = products.filter(product => product.id !== id)
  console.log("Deleted product with ID: ", id);
  res.status(204).end()
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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})