const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  variables: {
    key: {
      type: [String],
      required: true
    },
    value: {
      type: [String],
      required: true
    }
  },
  content: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
documentSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Document', documentSchema)
