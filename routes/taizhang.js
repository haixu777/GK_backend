const express = require('express')
const Router = express.Router()

const Taizhang = require('../models/taizhang')

Router.get('/list', (req, res, next) => {
  Taizhang.getList(req.query, (err, taizhangList) => {
    if (err) {
      throw err
      return
    }
    res.json({
      success: true,
      data: taizhangList
    })
  })
})

Router.post('/add', (req, res, next) => {
  Taizhang.add(req.body, (err, msg) => {
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

Router.post('/update', (req, res, next) => {
  Taizhang._update(req.body, (err, msg) => {
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

Router.post('/del', (req, res, next) => {
  Taizhang.del(req.body, (err, msg) => {
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
