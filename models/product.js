const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: "misc"
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
})
productSchema.plugin(uniqueValidator)

// Transform _id to id and remove MongoDB default _v field
productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Product', productSchema)