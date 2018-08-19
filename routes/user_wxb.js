const express = require('express')
const Router = express.Router()

const User_wxb = require('../models/user_wxb')

Router.post('/update', (req, res, next) => {
  User_wxb.userSync(req.body, (err, msg) => {
    if (err) {
      throw err
      return
    }
    res.json({
      success: true,
      msg: msg
    })
  })
})

module.exports = Router
