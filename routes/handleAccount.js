const express = require('express')
const Router = express.Router()

const handleAccount = require('../models/handleAccount')

Router.get('/platform', (req, res, next) => {
  handleAccount.getPlatformList((err, platformList) => {
    if (err) {
      throw err
      return
    } else {
      res.json({
        success: true,
        platformList: platformList
      })
    }
  })
})

Router.get('/actionList', (req, res, next) => {
  handleAccount.getActionList((err, actionList) => {
    if (err) {
      throw err
      return
    } else {
      res.json({
        success: true,
        actionList: actionList
      })
    }
  })
})

/**
 * 处置账号查询
 */
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

/**
 * 处置账号删除
 */
Router.post('/del', (req, res, next) => {
  handleAccount.handleDel(req.body.id, (err, msg) => {
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

/**
 * 处置账号更新
 */
Router.post('/update', (req, res, next) => {
  handleAccount.handleUpdate(req.body, (err, msg) => {
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

/**
 * 处置账号添加
 */
Router.post('/add', (req, res, next) => {
  handleAccount.handleAdd(req.body, (err, msg) => {
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

module.exports = Router
