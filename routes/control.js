const express = require('express')
const Router = express.Router()
const formidable = require('formidable')

const Control = require('../models/control')
const Control_auto = require('../models/control/auto_results')
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

Router.get('/fetchAutoList', (req, res, next) => {
  let condition = Object.assign(
    {},
    {
      perItem: Number(req.query.perItem),
      currentPage: Number(req.query.currentPage),
      sort_key: req.query.sort_key,
      sort_order: req.query.sort_order
    }
  )
  Control_auto.getList(condition ,(err, resObj) => {
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

Router.post('/del', (req, res, next) => {
  let control_id = req.body.id
  Control.del(control_id, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

Router.post('/delAuto', (req, res, next) => {
  let auto_id = req.body.id
  Control_auto.del(auto_id, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

Router.post('/confirmCheck', (req, res, next) => {
  let reqObj = Object.assign(
    {},
    {
      id: req.body.auto_id,
      check: req.body.check,
      descript: req.body.descript,
      number: req.body.number,
      range: req.body.range,
      time: new Date(req.body.time),
      event: req.body.event,
      eventId: req.body.eventId,
      sample_type: req.body.sample_type
    }
  )
  Control_auto.confirmCheck(reqObj, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

Router.post('/handleVerify', (req, res, next) => {
  Control.verify(req.body.id, req.body.verify, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

Router.post('/uploadFile', (req, res, next) => {
  res.json({
    success: true
  })
})

module.exports = Router
