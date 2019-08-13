const express = require('express')
const bodyParser = require('body-parser')
const Mushroom = require('../models/mushroom')
const mongoose = require('mongoose')

// create a router via express
const router = express.Router()
const jsonParser = bodyParser.json()

/* ========== GET ALL  ========== */
router.get('/', jsonParser, (req,res, next) => {
    Mushroom.find()
        .exec()
        .then(doc => {
            return res.status(200).json(docs)
        })
        .catch(err => next(err))
})

/* ========== GET ONE BY ID ========== */


/* ========== POST ========== */
router.post('/', jsonParser, (req, res, next) => {
    let {name, color, age} = req.body;

    if(!name || name === '' || !age || age === null){
        const err = {
            message: `Missing 'name' or 'age' in request body`,
            reason: 'MissingContent',
            status: 400,
            location: 'POST'
        }
        return next(err)
    }

    Mushrooom.create({name, color, age})
        .then(data => {
            return res.location(`${req.originalUrl}/${data.id}`)
            .status(201).json(data)
        })
        .catch(err => next(err))
}
)

/* ========== PUT ========== */


/* ========== DELETE ========== */

module.exports = router