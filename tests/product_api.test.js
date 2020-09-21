const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Product = require('../models/product')

const initialProducts = [
  {
    'name': 'turkey',
    'category': 'produce',
    'quantity': 0,
    'created_at': new Date()
  },
  {
    'name': 'rice',
    'category': 'produce',
    'quantity': 0,
    'created_at': new Date()
  },
  {
    'name': 'vinegar',
    'category': 'produce',
    'quantity': 0,
    'created_at': new Date()
  }
]

beforeEach(async () => {
  await Product.deleteMany({})

  let productObject = new Product(initialProducts[0])
  await productObject.save()

  productObject = new Product(initialProducts[1])
  await productObject.save()

  productObject = new Product(initialProducts[2])
  await productObject.save()
})

test('products are returned as json', async () => {
  await api
    .get('/api/products')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all products are returned', async () => {
  const response = await api.get('/api/products')

  expect(response.body).toHaveLength(initialProducts.length)
})

test('a specific product is within the returned products', async () => {
  const response = await api.get('/api/products')

  const names = response.body.map(product => product.name)

  expect(names).toContain('rice')
})

afterAll(() => {
  mongoose.connection.close()
})