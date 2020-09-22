const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const productSchema = new mongoose.Schema({
  name: String,
  created_at: Date,
  category: String,
  quantity: Number
})

const Product = mongoose.model('Product', productSchema)

// //Test adding a new product
// const product = new Product({
//     name: "new product!",
//     created_at: new Date(),
//     category: 'frozen',
//     quantity: 5
// })

// product.save().then(result => {
//   console.log('product saved!')
//   mongoose.connection.close()
// })

Product.find({}).then(result => {
  result.forEach(product => {
    console.log(product)
  })
  mongoose.connection.close()
})