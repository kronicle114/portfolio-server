const mongoose = require('mongoose')

// create schema
const MushroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String
    }, 
    age: {
        type: Number,
        required: true
    }
})

// virtualize
MushroomSchema.set('timestamps', true)

MushroomSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, result) => {
        delete result._id
        delete result.__v
    }
})

// export the model
module.exports = mongoose.model('Mushroom', MushroomSchema)