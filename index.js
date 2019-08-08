const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')  // we will use this later for when we connect the frontend
// const mongoose = require('mongoose') // we will use this later when we connect to the db
const bodyParser = require('body-parser')

// get our client url, get our database configs/url, and your port
const { PORT } = require('./config')

// build an express app
const app = express()

// log all requests but skip testing
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
}))

// do cors stuff

// load your public assets
app.use(express.static('public'))

// body parser
app.use(bodyParser.json())

// api endpoints
app.get('/', (req, res, next) => {
    return res.json('hello world')
})

//error handler


// add db listener
app.listen(PORT, function () {
    console.info(`listening on PORT ${this.address().port}`)
}).on('error', err => console.error(err))

// export app for testing