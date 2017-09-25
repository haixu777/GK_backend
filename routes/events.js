const express = require('express')
const Router = express.Router()
const path = require('path')
const fs = require('fs')
const exec = require('child-process-promise').exec

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'process_image/')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.eventId + '.jpg')
  }
})

var upload = multer({ storage: storage }).array('file')

const Events = require('../models/events')
const Control = require('../models/control')
const Sample = require('../models/sample')
const Keywords = require('../models/keywords')
const Persons = require('../models/person')
const Platform = require('../models/platforms')
const Account = require('../models/account')
const Group = require('../models/group')

/*
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
*/

Router.post('/update', (req, res, next) => {
  const newEvent = {
    id: req.body.id,
    name: req.body.name,
    descript: req.body.descript,
    level: req.body.level.join(),
    type: Number(req.body.type),
    parent_id: req.body.level[req.body.level.length - 1],
    harm_level: req.body.harm_level,
    occurrence_time: req.body.occurrence_time,
    edit_time: req.body.edit_time ? req.body.edit_time : new Date(),
    recurrence: req.body.recurrence,
    alertRange: req.body.alertRange,
    category: req.body.category,
    remark: req.body.remark
  }
  Events.addEvent(newEvent, (err, new_event) => {
    if (err) throw err
    res.json({
      success: true,
      msg: newEvent.id ? (`事件: ${req.body.name}, 更新成功!`) : (`事件: ${req.body.name}, 添加成功!`)
    })
  })
})

Router.get('/tree', (req, res, next) => {
  Events.getTree((err, tree) => {
    if (err) throw err
    res.json({
      tree: tree
    })
  })
})

Router.post('/del', (req, res, next) => {
  Events.delEvents(req.body.id, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

Router.get('/list', (req, res, next) => {
  let month = req.query.month
  Events.getEventList(month,(err, eventList) => {
    if (err) throw err
    res.json({
      success: true,
      eventList: eventList
    })
  })
})

Router.get('/fetchEventControl', (req, res, next) => {
  let eventId = req.query.id
  Control.getControlByEvent(eventId, (err, controlList) => {
    if (err) throw err
    res.json({
      success: true,
      controlList: controlList
    })
  })
})

Router.get('/fetchEventSample', (req, res, next) => {
  let eventId = req.query.id
  Sample.getSampleByEvent(eventId, (err, sampleList) => {
    if (err) throw err
    res.json({
      success: true,
      sampleList: sampleList
    })
  })
})

Router.get('/fetchEventByMonth', (req, res, next) => {
  let queryObj = {
    recurrence: Number(req.query.recurrence),
    view: Number(req.query.view),
    tag_id: req.query.tag_id,
    user_id: req.query.user_id
  }
  Events.getEventByMonth(queryObj, (err, eventsList) => {
    if (err) throw err
    res.json({
      success: true,
      eventsList: eventsList
    })
  })
})

Router.get('/fetchByDay', (req, res, next) => {
  Events.getEventByDay(req.query, (err, eventList) => {
    if (err) throw err
    res.json({
      success: true,
      eventsList: eventList
    })
  })
})

Router.get('/timeline', (req, res, next) => {
  let eventId = req.query.eventId
  Control.getTimelineByEventId(eventId, (err, timeline) => {
    if (err) throw err
    res.json({
      success: true,
      timeline: timeline
    })
  })
})

Router.get('/notice', (req, res, next) => {
  let now = new Date()
  Events.getNotice(now, (err, noticeList) => {
    if (err) throw err
    res.json({
      success: true,
      noticeList: noticeList
    })
  })
})

Router.get('/fetchkeywords', (req, res, next) => {
  let eventId = req.query.eventId
  Keywords.fetchByEventId(eventId, (err, keywordsList) => {
    if (err) throw err
    res.json({
      success: true,
      keywordsList: keywordsList
    })
  })
})

Router.get('/fetchPersons', (req, res, next) => {
  Persons.fetchByEventId(req.query.eventId, (err, personList) => {
    if (err) throw err
    res.json({
      success: true,
      personList: personList
    })
  })
})

Router.get('/fetchPlatform', (req, res, next) => {
  Platform.fetchByEventId(req.query.eventId, (err, platformList) => {
    if (err) throw err
    res.json({
      success: true,
      platformList: platformList
    })
  })
})

Router.get('/fetchAccount', (req, res, next) => {
  /*
  Account.fetchByEventId(req.query.eventId, (err, accountList) => {
    if (err) throw err
    res.json({
      success: true,
      accountList: accountList
    })
  })
  */
  Sample.fetchAccountByEventId(req.query.eventId, (err, accountList) => {
    if (err) throw err
    res.json({
      success: true,
      accountList: accountList
    })
  })
})

Router.get('/fetchGroup', (req, res, next) => {
  Group.fetchByEventId(req.query.eventId, (err, groupList) => {
    if (err) throw err
    res.json({
      success: true,
      groupList: groupList
    })
  })
})

Router.post('/process_upload', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) throw err
    res.json({
      success: true,
      msg: '上传成功'
    })
  })
})

Router.get('/process_image', (req, res, next) => {
  // res.sendFile(path.join(__dirname, '../process_image', '220.jpg'))
  var imagePath = 'process_image/' + req.query.eventId + '.jpg'
  fs.exists(imagePath, (isExists) => {
    if (isExists) {
      fs.readFile(imagePath, (err, data) => {
        if (err) throw err
        res.json({
          success: true,
          buffer: data
        })
      })
    } else {
      res.json({
        success: false,
        msg: 'image does not exists!'
      })
    }
  })
})

Router.post('/process_image/del', (req, res, next) => {
  var imagePath = 'process_image/' + req.body.eventId + '.jpg'
  fs.exists(imagePath, (isExists) => {
    if (isExists) {
      exec(`rm ${imagePath}`, (err, out) => {
        if (err) throw err
        res.json({
          success: true,
          msg: '删除成功'
        })
      })
    } else {
      res.json({
        success: false,
        msg: '图片不存在'
      })
    }
  })
})

module.exports = Router
