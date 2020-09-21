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

const nonExistingId = async () => {
  const product = new Product({ name: 'willremovethissoon', created_at: new Date() })
  await product.save()
  await product.remove()

  return product._id.toString()
}

const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(product => product.toJSON())
}

module.exports = {
  initialProducts, nonExistingId, productsInDb
}