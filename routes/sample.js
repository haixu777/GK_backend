const express = require('express')
const Router = express.Router()
const exec = require('child-process-promise').exec

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/')
  },
  filename: function (req, file, cb) {
    // console.log(file)
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage }).array('file')

const Events = require('../models/events')
const Sample = require('../models/sample')
const Sample_auto =require('../models/sample/auto_results')

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

Router.post('/upload', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) throw err
    let sample = Object.assign(
      {},
      {
        name: req.files[0].filename,
        path: req.files[0].path
      }
    )
    Sample_auto.upload(sample, (err, msg) => {
      res.json({
        success: true,
        msg: msg
      })
    })
  })
})

function run(cmd, file){
  var spawn = require('child_process').spawn
  var command = spawn(cmd, file)
  var result = ''
  command.stdout.on('data', function(data) {
    result += data.toString()
  })
  command.on('close', function(code) {
    console.log(result)
    return result
  })
}

// ------------- samples_auto ---------------
Router.get('/fetchAutoList', (req, res, next) => {
  let reqObj = Object.assign(
    {},
    {
      perItem: Number(req.query.perItem),
      currentPage: Number(req.query.currentPage),
      sort_key: req.query.sort_key,
      sort_order: req.query.sort_order
    }
  )
  Sample_auto.getList(reqObj, (err, sampleList) => {
    res.json({
      success: true,
      data: sampleList
    })
  })
})

Router.get('/autoIsExist', (req, res, next) => {
  Sample_auto.isExist(req.query.name, (err, isExist) => {
    res.json({
      success: true,
      isExist: isExist
    })
  })
})

module.exports = Router