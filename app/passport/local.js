const { Strategy: LocalStrategy } = require('passport-local')
const User = require('../models/user')

const localStrategy = new LocalStrategy((username, password, done) => {
    let user;
    User.findOne({ username })
        .then( results => {
            if (!user) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username',
                    location: 'username'
                })
            }
        })
        .then(isValid => {
            if(!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect password',
                    location: 'password'
                })
            }
            return done(null, false)
        })
        .catch(err => {
            if (err.reason === 'LoginError') {
                return done(null, false)
            }
            return done(err)
        })
})

module.exports = localStrategy