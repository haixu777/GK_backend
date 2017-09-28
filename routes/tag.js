const express = require('express')
const Router = express.Router()

const Tag = require('../models/tag')
const Wxb_user = require('../models/wxb_user')

Router.get('/list', (req, res, next) => {
  Tag.getList(req.query.userId, req.query.dept_name, req.query.domain, req.query.currentPage, Number(req.query.perItem), (err, tagList) => {
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

Router.post('/add', (req, res, next) => {
  Tag.handleAdd(req.body.userId, req.body.dept_name, req.body.name, req.body.domain, (err, msg) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      })
    } else {
      res.json({
        success: true,
        msg: msg
      })
    }
  })
})

Router.post('/rename', (req, res, next) => {
  Tag.rename(req.body.id, req.body.name, (err, msg) => {
    if (err) {
      throw err
      return
    } else {
      res.json({
        success: true,
        msg: '标签: ' + req.body.name + ', 修改成功!'
      })
    }
  })
})

Router.post('/del', (req, res, next) => {
  Tag.del(req.body.id, (err, msg) => {
    if (err) {
      throw err
      return
    } else {
      res.json({
        success: true,
        msg: msg
      })
    }
  })
})

Router.post('/bind', (req, res, next) => {
  Tag.bind(req.body.eventId, req.body.tagId, (err, msg) => {
    if (msg == '绑定重复') {
      res.json({
        success: false,
        msg: msg
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
