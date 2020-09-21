const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Product = require('../models/product')

beforeEach(async () => {
  await Product.deleteMany({})

  let productObject = new Product(helper.initialProducts[0])
  await productObject.save()

  productObject = new Product(helper.initialProducts[1])
  await productObject.save()

  productObject = new Product(helper.initialProducts[2])
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

  expect(response.body).toHaveLength(helper.initialProducts.length)
})

test('a specific product is within the returned products', async () => {
  const response = await api.get('/api/products')

  const names = response.body.map(product => product.name)

  expect(names).toContain('rice')
})

test('a valid product can be added', async () => {
  const testProduct = {
    name: 'async',
    category: 'frozen',
    quantity: 999
  }

  await api
    .post('/api/products')
    .send(testProduct)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // Product has been added
  const productsAtEnd = await helper.productsInDb()
  expect(productsAtEnd).toHaveLength(helper.initialProducts.length + 1)

  // The new product information is present
  const contents = productsAtEnd.map(product => product.name)
  expect(contents).toContain('async')
})

test('product without name is not added', async () => {
  const testProduct = {
    name: '',
    category: 'frozen',
    quantity: 999
  }

  await api
    .post('/api/products')
    .send(testProduct)
    .expect(400)

  const productsAtEnd = await helper.productsInDb()
  expect(productsAtEnd).toHaveLength(helper.initialProducts.length)
})

afterAll(() => {
  mongoose.connection.close()
})