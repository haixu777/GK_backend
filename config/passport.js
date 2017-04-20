const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config')
const User = require('../models/user')

module.exports = function(passport) {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = config.secret
  passport.use(new JwtStrategy(opts, (jwt_playload, done) => {
    User.findById(jwt_playload.id).then((user) => {
      done(null, user)
    }).catch((err) => {
      done(err, null)
    })
  }))
}
