const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String }
})

// Add createdAt and updatedAt fields
schema.set('timestamps', true)

schema.set('toJSON', {
    virtuals: true,
    transform: (doc, result) => {
      delete result._id
      delete result.__v
    }
})

module.exports = mongoose.model('Note', schema)