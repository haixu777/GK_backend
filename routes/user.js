const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/user')

router.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err
    if (!user) {
      return res.json({success: false, msg: 'User not found!'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        const token = jwt.sign(user.dataValues, config.secret, {
          expiresIn: 604800
        })
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password!'})
      }
    })
  })
})

router.post('/register', (req, res, next) => {
  const newUser = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }
  User.addUser(newUser, (err, user) => {
    if (err) {
      throw err
      res.json({success: false, msg: 'Failed to register User!'})
    } else {
      res.json({success: true, msg: 'User registered!'})
    }
  })
})

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({
    success: true,
    user: {
      name: req.user.name,
      username: req.user.username,
      email: req.user.email
    }
  })
})

module.exports = router
