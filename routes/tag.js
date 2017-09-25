const express = require('express')
const Router = express.Router()

const Tag = require('../models/tag')
const Wxb_user = require('../models/wxb_user')

Router.get('/list', (req, res, next) => {
  Wxb_user.list(req.query.userId, (err, tagList) => {
    if (err) {
      throw err
      res.json({
        success: false,
        err: err
      })
    } else {
      res.json({
        success: true,
        tagList: tagList
      })
    }
  })
})

Router.post('/bind', (req, res, next) => {
  Tag.bind(req.body.userId, req.body.eventId, req.body.tag, (err, msg) => {
    if (err == '重复绑定') {
      res.json({
        success: false,
        msg: '重复绑定'
      })
    } else if (err) {
      throw err
      res.json({
        success: false,
        msg: '绑定失败'
      })
    } else {
      res.json({
        success: true,
        msg: msg
      })
    }
  })
})

Router.post('/unbind', (req, res, next) => {
  Tag.unbind(req.body.tagId, req.body.eventId, req.body.userId, (err, msg) => {
    if (err) {
      throw err
      res.json({
        success: false,
        msg: '解除标签失败'
      })
    } else {
      res.json({
        success: true,
        msg: msg
      })
    }
  })
})

module.exports = Router
