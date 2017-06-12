const express = require('express')
const Router = express.Router()

const Keywords = require('../models/keywords')

Router.get('/list', (req, res, next) => {
  Keywords.getList(req.query.word, req.query.eventId, (err, keywordsList) => {
    if (err) throw err
    res.json({
      success: true,
      keywordsList: keywordsList
    })
  })
})

Router.post('/event2keyword', (req, res, next) => {
  Keywords.event2keyword(req.body, (err, info) => {
    if (err) throw err
    res.json({
      success: true,
      msg: info
    })
  })
})

module.exports = Router
