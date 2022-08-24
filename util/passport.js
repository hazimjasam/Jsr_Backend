const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const client = require('../models/employee')



function userStrategy(passport) {



    passport.use('user-local', new LocalStrategy(function (username, password, done) {

        client.findOne({ name: username }).exec((err, doc) => {
            if (err) throw err
            if (!doc) {
                return done(null, false, { message: "خطا في الاسم" })
            }
            bcrypt.compare(password, doc.pwd, function (err, isMatch) {
                if (err) throw err
                if (!isMatch) {
                    return done(null, false, { message: "خطا في كلمة السر" })
                }
                return done(null, doc)
            })
        })
    }))
}


function serializeUser(passport) {
    passport.serializeUser(function (user, done) {
        done(null, { id: user.id, })
    })
}
function deserializeUser(passport) {
    passport.deserializeUser(function (user, done) {
        client.findById(user.id, "-pwd", function (err, doc) {

            done(err, doc)
        })
    })
}


module.exports = {
    userStrategy: userStrategy,
    serializeUser: serializeUser,
    deserializeUser, deserializeUser
}