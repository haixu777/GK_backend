const express = require('express')
const Router = express.Router()
const Total = require('../models/total')

Router.get('/list', (req, res, next) => {
  Total.getAll(req.query, (err, data) => {
    if (err) {
      throw err
      return
    } else {
      res.json({
        success: true,
        data: data
      })
    }
  })
})

Router.get('/item', (req, res, next) => {
  Total.getItem(req.query, (err, data) => {
    if (err) {
      throw err
      return
    } else {
      res.json({
        success: true,
        data: data
      })
    }
  })
})

module.exports = Router
