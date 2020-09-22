const app = require('../../app')
const helper = require('../test_helper')
const mongoose = require('mongoose')
const Product = require('../../models/product')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
  await Product.deleteMany({})

  const productObjects = helper.initialProducts
    .map(product => new Product(product))
  const promiseArray = productObjects.map(product => product.save())
  await Promise.all(promiseArray)
})

describe('when there are initially some products saved', () => {

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
})

describe('viewing a specific product', () => {

  test('a valid product ID can be viewed', async () => {
    const productsAtStart = await helper.productsInDb()

    const productToView = productsAtStart[0]

    const resultProduct = await api
      .get(`/api/products/${productToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedProductToView = JSON.parse(JSON.stringify(productToView))

    expect(resultProduct.body).toEqual(processedProductToView)
  })

  test('fails with statuscode 404 if product does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/products/${validNonexistingId}`)
      .expect(404)
  })
})

describe('addition of a new product', () => {

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

})


describe('deletion of a product', () => {
  test('a product can be deleted', async () => {
    const productsAtStart = await helper.productsInDb()
    const productToDelete = productsAtStart[0]

    await api
      .delete(`/api/products/${productToDelete.id}`)
      .expect(204)

    const productsAtEnd = await helper.productsInDb()

    expect(productsAtEnd).toHaveLength(
      helper.initialProducts.length - 1
    )

    const contents = productsAtEnd.map(product => product.name)

    expect(contents).not.toContain(productToDelete.name)
  })
})

afterAll(() => {
  mongoose.connection.close()
})