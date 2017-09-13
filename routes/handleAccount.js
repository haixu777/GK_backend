const express = require('express')
const Router = express.Router()

const handleAccount = require('../models/handleAccount')

Router.get('/list', (req, res, next) => {
  handleAccount.getList(req.query, (err, accountList) => {
    if (err) {
      throw err
      return
    }
    res.json({
      success: true,
      data: accountList
    })
  })
})

module.exports = Router
