const express = require('express')
const Router = express.Router()

const Control = require('../models/control')
const Events = require('../models/events')

Router.get('/fetchList', (req, res, next) => {
  let condition = Object.assign(
    {},
    {
      perItem: Number(req.query.perItem),
      currentPage: Number(req.query.currentPage),
      sort_key: req.query.sort_key,
      sort_order: req.query.sort_order
    }
  )
  Control.getList(condition ,(err, resObj) => {
    if (err) throw err
    res.json({
      success: true,
      controlList: resObj.controlList,
      totalItem: resObj.totalItem
    })
  })
})

Router.get('/fetchEventListForControl', (req, res, next) => {
  Events.fetchEventListForControl((err, eventsList) => {
    if (err) throw err
    res.json({
      success: true,
      eventsList: eventsList
    })
  })
})

Router.post('/updateControl', (req, res, next) => {
  let control_item = Object.assign(
    {},
    {
      id: req.body.id,
      descript: req.body.descript,
      eventId: req.body.eventId,
      number: req.body.number,
      range: req.body.range,
      sample_type: req.body.sample_type,
      time: req.body.time
    }
  )
  Control.updateControlToServer(control_item, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

module.exports = Router
