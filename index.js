const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport');
// const cors = require('cors')  // we will use this later for when we connect the frontend

// get our client url, get our database configs/url, and your port
const { PORT, DATABASE_URL } = require('./config')
const localStrategy = require('./app/passport/local')
const jwtStrategy = require('./app/passport/jwt')

// require routers
// const mushroomsRouter = require('./app/routes/mushrooms')
const usersRouter = require('./app/routes/users')
const authRouter = require('./app/routes/auth')

// build an express app
const app = express()

// log all requests but skip testing
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
}))

// do cors stuff
// app.use(cors())  // if you have a client_origin url from your config file then pass it in inside of cors ex. cors({orign: CLIENT_ORIGIN})

// load your public assets
app.use(express.static('public'))

// body parser
app.use(bodyParser.json())

// public api endpoints
// app.get('/', (req, res, next) => {
//     return res.json('hello world')
// })
// app.use('/api/mushrooms', mushroomsRouter)

// utilize strategies
passport.use(localStrategy)
passport.use(jwtStrategy)

// protected endpoints
const jwtAuth = passport.authenticate('jwt', {
    session: false, failWithError: true
})


// mount routers
app.use('/api/users', usersRouter)
app.use('/api', authRouter)

// custom 404 not found route handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// catch all error handler
app.use((err, req, res, next) => {
    if (err.status) {
        const errBody = Object.assign({}, err, { message: err.message })
        res.status(err.status).json(errBody)
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
        console.log(err.name === 'FakeError' ? '' : err)
      }
})


// add db listener
if(require.main === module){ // prevents server from automatically running when we run tests
    // Connect to DB and Listen for incoming connections
    mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).catch( err => {
        console.error('Mongoose failed to connect')
        console.error(err)
    })

    // run server
    app.listen(PORT, function () {
        console.info(`Server listening on PORT ${this.address().port}`)
    }).on('error', err => console.error(err))

}

module.exports = app // export app for testing