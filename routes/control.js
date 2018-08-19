const express = require('express')
const Router = express.Router()
const formidable = require('formidable')
const rp = require('request-promise')

const Control = require('../models/control')
const Control_auto = require('../models/control/auto_results')
const Events = require('../models/events')

const exec = require('child_process').exec

const servePath = '../../likun/bc0612/testData/2016/11/22'
const fs = require('fs')
const mkdirp = require('mkdirp')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var now = new Date()
    fs.stat(servePath, (err, stat) => {
      if (err) {
        mkdirp(servePath, (err) => {
       	  if (err) {
       	  	throw err
       	  } else {
       	  	cb(null, servePath+'/')
       	  }
        })
      } else {
        cb(null, servePath+'/')
      }
    })
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage }).array('file')

/**
 * 管控记录查找
 */
Router.get('/fetchList', (req, res, next) => {
  let condition = Object.assign(
    {},
    {
      perItem: Number(req.query.perItem),
      currentPage: Number(req.query.currentPage),
      sort_key: req.query.sort_key,
      sort_order: req.query.sort_order,
      time_start: req.query.time_start,
      time_end: req.query.time_end,
      event_id: req.query.event_id,
      verify: req.query.verify
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

/**
 * 单条管控记录更改
 */
Router.post('/updateControl', (req, res, next) => {
  let control_item = Object.assign(
    {},
    {
      id: req.body.id,
      descript: req.body.descript,
      eventId: req.body.eventId,
      number: req.body.number,
      range: req.body.range,
      operation: req.body.operation,
      sample_type: req.body.sample_type,
      time: req.body.time,
      verify: req.body.verify
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

/**
 * 单条管控记录删除
 */
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
      operation: req.body.operation,
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

/**
 * 单条管控记录添加
 */
Router.post('/add', (req, res, next) => {
  let reqObj = Object.assign(
    {},
    {
      descript: req.body.descript,
      number: req.body.number,
      range: req.body.range,
      operation: req.body.operation,
      time: new Date(req.body.time),
      eventId: req.body.eventId,
      sample_type: req.body.sample_type
    }
  )
  Control.addItem(reqObj, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: msg
    })
  })
})

Router.post('/auto_update', (req, res, next) => {
  let reqObj = Object.assign(
    {},
    {
      id: req.body.id,
      descript: req.body.descript,
      number: req.body.number,
      range: req.body.range,
      operation: req.body.operation,
      time: new Date(req.body.time),
      eventId: req.body.eventId,
      sample_type: req.body.sample_type
    }
  )
  Control_auto._update(reqObj, (err, msg) => {
    if (err) throw err
    res.json({
      success: true,
      msg: '记录更新成功!'
    })
  })
})

Router.get('/statisticsByEventId', (req, res, next) => {
  Control.statisticsByEventId(req.query, (err, data) => {
    if (err) throw err
    res.json({
      success: true,
      data: data
    })
  })
})

Router.get('/statisticsByTime', (req, res, next) => {
  Control.statisticsByTimeRange(req.query.time_start, req.query.time_end, (err, data) => {
    if (err) throw err
    res.json({
      success: true,
      data: data
    })
  })
})

// -------------- upload start --------------
/**
 * 日志文件上传
 */
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
    console.log(req, res, err)
    res.json({
      success: true,
      data: '上传成功'
    })
  })
})

// ------------- upload end -------------------

Router.get('/extractList', (req, res, next) => {
  exec('cd ' + servePath + ' && ls', (err,stdout,stderr) => {
    let list = stdout.split('\n')
    let Arr = []
    list.forEach((item) => {
      if (item) {
        Arr.push({
          name: item
        })
      }
    })
    res.json({
      success: true,
      data: Arr
    })
  })
})

Router.post('/fileDelete', (req, res, next) => [
  exec('cd ' + servePath + ' && rm -f ' + req.body.filename, (err, stdout, stderr) => {
    if (stderr) return stderr
    res.json({
      success: true,
      msg: '文件删除成功'
    })
  })
])


// test
/*
console.log('day')
rp({
  uri: 'http://localhost:8014/month',
  json: true
}).then((res) => {
  console.log(res[1].operation)
  console.log(res.length)
}).catch((err) => {
  console.log(err)
})

*/

// test end


Router.post('/extract', (req, res, next) => {
  var options = {
    uri: 'http://localhost:8014/day?path=testData/2016/11/22',
    json: true
  }

  rp(options)
    .then((stdout) => {
      //console.log(stdout)
      //let result = JSON.parse(stdout)
      Control.extractDateAdd(stdout, req.body.date, (err, msg) => {
        if (err) throw err
        exec('cd ' + servePath + ' && rm -f *.txt', (err, stdout, stderr) => {
          if (stderr) throw err
          res.json({
            success: true,
            num: msg
          })
        })
      })
    }).catch((err) => {
      throw err
    })
  /*
  exec('curl http://localhost:8012/control/extractList', (err, stdout, stderr) => {
    let result = JSON.parse(stdout)
    Control.extractDateAdd(result, req.body.date, (err, msg) => {
      if (err) throw err
      exec('cd ' + servePath + ' && rm -f *.txt', (err, stdout, stderr) => {
        if (stderr) throw err
        res.json({
          success: true,
          num: msg
        })
      })
    })
  })
  */
})

/*
rp(
 {
   uri: encodeURI('http://localhost:8014/parse?path=/root/haixu/中文.html'),
   json: true
  }
).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
})
*/

module.exports = Router
