const express = require('express')
const Router = express.Router()

const Events = require('../models/events')
const Topic_1 = require('../models/events/topic_1')
const Topic_2 = require('../models/events/topic_2')

Router.post('/addEvent', (req, res, next) => {
  const newEvent = {
    event_name: req.body.event_name,
    event_descript: req.body.event_descript,
    topic_1: req.body.topic_1,
    topic_2: req.body.topic_2,
    occurrence_time: new Date(req.body.occurrence_time * 1000),
    forensic_date: new Date(req.body.forensic_date * 1000)
  }

  Events.addEvent(newEvent, (err, newEvent) => {
    if (err) throw err
    res.json({
      success: true,
      msg: 'event added!'
    })
  })
})

Router.get('/getTree', (req, res, next) => {
  Events.getTree((err, tree) => {
    res.json({
      tree: tree
    })
  })
})

Router.post('/update', (req, res, next) => {
  if (req.body.hasOwnProperty('topic1_id')) {
    req.body.id = req.body.topic1_id
    Topic_1.updateTopic(req.body, (err, topic) => {
      if (err) throw err
      res.json({
        success: true,
        msg: 'update topic_1 succeed!',
        info: topic
      })
    })
  } else if (req.body.hasOwnProperty('topic2_id')) {
    req.body.id = req.body.topic2_id
    Topic_2.updateTopic(req.body, (err, topic) => {
      if (err) throw err
      res.json({
        success: true,
        msg: 'update topic_2 succeed!',
        info: topic
      })
    })
  } else if (req.body.hasOwnProperty('event_id')) {
    req.body.id = req.body.event_id
    Events.updateEvent(req.body, (err, events) => {
      if (err) throw err
      res.json({
        success: true,
        msg: 'update event succeed!',
        info: events
      })
    })
  } else if (req.body.hasOwnProperty('mainTopic_id')) {
    res.json({
      success: false,
      msg: 'cannot change anything with main_topic!!'
    })
  }
})

module.exports = Router
