const express = require('express')
const Router = express.Router()

const Events = require('../models/events')
const Sample = require('../models/sample')

Router.get('/fetchList', (req, res, next) => {
  let reqObj = Object.assign(
    {},
    {
      perItem: Number(req.query.perItem),
      currentPage: Number(req.query.currentPage),
      sort_key: req.query.sort_key,
      sort_order: req.query.sort_order
    }
  )
  Sample.getList(reqObj, (err, sampleList) => {
    res.json({
      success: true,
      data: sampleList
    })
  })
})

Router.post('/update', (req, res, next) => {
  Sample.updateSample(req.body, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      info: msg
    })
  })
})

Router.post('/del', (req, res, next) => {
  let sample_id = req.body.id
  Sample.del(sample_id, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      info: msg
    })
  })
})

module.exports = Router
