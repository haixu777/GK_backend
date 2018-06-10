const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Events = require('../events')
// const Auto_control = require('./auto_results')

const Control = db.define('control_programs', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  control_time: Sequelize.DATE,
  control_range: Sequelize.STRING,
  control_operation: Sequelize.STRING,
  control_descript: Sequelize.STRING,
  control_number: Sequelize.INTEGER,
  sample_type: Sequelize.STRING,
  event_id: Sequelize.INTEGER,
  auto_id: Sequelize.INTEGER,
  verify: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Control.belongsTo(Events)
Events.hasMany(Control)

module.exports = Control

module.exports.getControlByEvent = function(eventId, cb) {
  Control.findAll({
    where: {
      event_id: eventId
    }
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getTimelineByEventId = function(id, cb) {
  Control.findAll({
    where: {
      event_id: id
    },
    order: [
      ['control_time', 'DESC']
    ]
  }).then((eventsList) => {
    const resObj = eventsList.map((events) => {
      return Object.assign(
        {},
        {
          id: events.id,
          time: $utils.formatTime(events.control_time),
          content: events.control_descript,
          action: events.control_operation
        }
      )
    })
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getList = function(conditionObj ,cb) {
  conditionObj.currentPage--
  Control.findAndCountAll({
    limit: conditionObj.perItem,
    offset: conditionObj.currentPage * conditionObj.perItem,
    where: {
      // control_time: {
      //   lte: conditionObj.time_end,
      //   gte: conditionObj.time_start
      // },
      control_time: conditionObj.time_start ? { lte: conditionObj.time_end, gte: conditionObj.time_start } : { $ne: null },
      event_id: conditionObj.event_id ? conditionObj.event_id : { $ne: null },
      verify: (conditionObj.verify === '' || conditionObj.verify === '-1') ? ({ $ne: null }) : (conditionObj.verify)
    },
    include: {
      model: Events,
      attributes: ['name'],
      where: {
      },
      required: false
    },
    order: conditionObj.sort_key + ' ' + conditionObj.sort_order
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        controlList: res.rows.map((item) => {
          let eventName = ''
          if (!item.event) {
            eventName = '未标注事件'
          } else {
            eventName = item.event.name
          }
          return Object.assign(
            {},
            {
              control_id: item.id,
              control_descript: item.control_descript,
              control_range: item.control_range,
              control_time: $utils.formatTime(item.control_time),
              control_operation: item.control_operation,
              sample_type: item.sample_type,
              control_number: item.control_number,
              event: eventName,
              event_id: item.event_id,
              verify: item.verify
            }
          )
        }),
        totalItem: res.count
      }
    )
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.updateControlToServer = function(control_item, cb) {
  Control.update(
    {
      control_descript: control_item.descript,
      control_number: control_item.number,
      control_range: control_item.range,
      control_time: control_item.time,
      control_operation: control_item.operation,
      sample_type: control_item.sample_type,
      event_id: control_item.eventId,
      verify: control_item.verify
    },
    {
      where: {
        id: control_item.id
      }
    }
  ).then((control) => {
    cb(null, ('update control success! id: ' + control_item.id))
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.del = function(control_id, cb) {
  Control.destroy({
    where: {
      id: control_id
    }
  }).then((control) => {
    cb(null, '删除成功!')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.verify = function(id, verify, cb) {
  if (verify) {
    Control.update(
      {
        verify: verify
      },
      {
        where: {
          id: id
        }
      }
    ).then((res) => {
      cb(null, '审核通过!')
    }).catch((err) => {
      cb(err, false)
    })
  } else {
    Control.findById(id).then((item) => {
      require('./auto_results').update(
        {
          check: 0
        },
        {
          where: {
            id: item.auto_id
          }
        }
      ).then((res) => {
        Control.destroy({
          where: {
            id: id
          }
        }).then((res) => {
          cb(null, '审核拒绝')
        }).catch((err) => {
          cb(err, false)
        })
      }).catch((err) => {
        cb(err, false)
      })
    }).catch((err) => {
      cb(err, false)
    })
  }
}

module.exports.addItem = function(reqObj, cb) {
  let db_item = Control.build({
    control_time: reqObj.time,
    control_range: reqObj.range,
    control_operation: reqObj.operation,
    control_descript: reqObj.descript,
    control_number: reqObj.number,
    sample_type: reqObj.sample_type,
    event_id: reqObj.eventId,
    check: 0
  })
  db_item.save()
    .then((res) => {
      cb(null, '添加管控记录成功!')
    }).catch((err) => {
      cb(err, false)
    })
}

module.exports.uploadFile = function(file, cb) {
  cb(null, 'file')
}

module.exports.statisticsByEventId = function(eventId, cb) {
  Control.findAll({
    where: {
      event_id: eventId
    },
    attributes: ['control_operation', 'sample_type', 'control_number']
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.statisticsByTimeRange = function(startTime, endTime, cb) {
  Control.findAll({
    where: {
      control_time: {
        $gte: startTime,
        $lte: endTime
      }
    },
    attributes: ['control_operation', 'sample_type', 'control_number'],
    include: {
      model: Events,
      attributes: ['name', 'occurrence_time']
    }
  }).then((res) => {
    let tempEventArr = {}
    let resObj = []
    res.forEach((item) => {
      tempEventArr[item.event.name] = item.event.occurrence_time
    })
    for (var name in tempEventArr) {
      resObj.push({
        name: name,
        occurrence_time: tempEventArr[name],
        control_programs: []
      })
    }
    res.forEach((item) => {
      resObj.forEach((res) => {
        if (res.name == item.event.name) {
          res.control_programs.push((item))
        }
      })
    })
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}
