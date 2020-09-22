const Product = require('../models/product')
const User = require('../models/user')

const initialUsers = [
  {
    'username': 'root',
    'email': 'root@root.com',
    'passwordHash': '$2b$10$MBjvYE4yDeHBfmpv332twesH7tbt0/ozXwEfzbke79HpfChIRpXjW',
    'created_at': new Date()
  }
]

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialProducts,
  initialUsers,
  nonExistingId,
  productsInDb,
  usersInDb
}