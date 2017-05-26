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
    exec('curl http://localost:3000/control/fetchEventListForControl')
      .then((res) => {
        let resObj = JSON.parse(res.stdout)
        console.log(resObj.success)
      }).catch((err) => {
        console.log(err)
      })
    res.json({
      success: true
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

module.exports = Router
