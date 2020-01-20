const express = require('express')
const bodyParser = require('body-parser')
const Mushroom = require('../models/mushroom')
// const mongoose = require('mongoose')

// create a router via express
const router = express.Router()
const jsonParser = bodyParser.json()

/* ========== GET ALL  ========== */
router.get('/', jsonParser, (req,res, next) => {
    //probably add filter later

    Mushroom.find()
        .then(docs => {
            return res.status(200).json(docs)
        })
        .catch(err => next(err))
})

/* ========== GET ONE BY ID ========== */
router.get('/:id', (req, res, next) => {
    let {id} = req.params

    // validate that id & error handler

    //find the document on mongodb & return the info back

})

/* ========== POST ========== */
router.post('/', jsonParser, (req, res, next) => {
    let {name, color, age} = req.body

    if(!name || name === '' || !age || age === null){
        const err = {
            message: `Missing 'name' or 'age' in request body`,
            reason: 'MissingContent',
            status: 400,
            location: 'POST'
        }
        return next(err)
    }

    Mushroom.create({name, color, age})
        .then(data => {
            return res.location(`${req.originalUrl}/${data.id}`)
            .status(201).json(data)
        })
        .catch(err => next(err))
}
)

/* ========== PUT ========== */
router.put('/:id', (req, res, next) => {
    const mushroom_id = req.params.id
    let {name, color, age} = req.body
    
    // error handler: make sure that user input is the valid data type

    // update
    let data = {name, color, age}

    //find the document on mongodb and then change it 
    Mushroom.findByIdAndUpdate(mushroom_id, data)    


})

/* ========== DELETE ========== */

module.exports = router