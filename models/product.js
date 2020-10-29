const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'misc'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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