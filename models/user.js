const Sequelize = require('sequelize')
const db = require('../config/database')
const config = require('../config')
const bcrypt = require('bcryptjs')

const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  admin: Sequelize.INTEGER
})

module.exports = User

module.exports.getUserByUsername = function(username, cb) {
  User.findOne({ where: {username: username} }).then((user) => {
    cb(null, user)
  }).catch((err) => {
    cb(err, null)
  })
}

module.exports.addUser = function(newUser, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err
      newUser.password = hash
      const dbUser = User.build(newUser)
      dbUser.save().then((user) => {
        cb(null, user)
      }).catch((err) => {
        cb(err, null)
      })
    })
  })
}

module.exports.comparePassword = function(candicatePassword, hash, cb) {
  bcrypt.compare(candicatePassword, hash, (err, isMatch) => {
    if (err) throw err
    cb(null, isMatch)
  })
}

module.exports.getList = function(cb) {
  User.findAll()
    .then((userList) => {
      let resObj = userList.map((user) => {
        return Object.assign(
          {},
          {
            value: user.id,
            text: user.name
          }
        )
      })
      cb(null, resObj)
    }).catch((err) => {
      cb(err, false)
    })
}
