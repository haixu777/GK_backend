const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Control = require('./')
const Events = require('../events')

// console.log(Control)

const Control_auto = db.define('control_programs_auto', {
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
  check: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Control_auto.belongsTo(Events)

module.exports = Control_auto

module.exports.getList = function(conditionObj ,cb) {
  conditionObj.currentPage--
  Control_auto.findAndCountAll({
    limit: conditionObj.perItem,
    offset: conditionObj.currentPage * conditionObj.perItem,
    where: {
      check: 0
    },
    include: {
      model: Events,
      attributes: ['name'],
      where: {
      },
      required: true
    },
    order: conditionObj.sort_key + ' ' + conditionObj.sort_order
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        controlList: res.rows.map((item) => {
          return Object.assign(
            {},
            {
              control_id: item.id,
              control_descript: item.control_descript,
              control_range: item.control_range,
              control_time: $utils.formatTime(item.control_time),
              sample_type: item.sample_type,
              control_number: item.control_number,
              event: item.event.name,
              event_id: item.event_id,
              check: item.check,
              operation: item.control_operation
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

module.exports.confirmCheck = function(reqObj, cb) {
  Control_auto.update(
    {
      check: 1,
      control_descript: reqObj.descript,
      control_number: reqObj.number,
      control_range: reqObj.range,
      control_time: reqObj.time,
      control_operation: reqObj.operation,
      event_id: reqObj.eventId,
      sample_type: reqObj.sample_type
    },
    {
      where: {
        id: reqObj.id
      }
    }
  ).then((res) => {
    Control_auto.findById(reqObj.id)
      .then((auto_item) => {
        let db_item = Control.build({
          control_time: auto_item.control_time,
          control_range: auto_item.control_range,
          control_operation: auto_item.control_operation,
          control_descript: auto_item.control_descript,
          control_number: auto_item.control_number,
          sample_type: auto_item.sample_type,
          event_id: auto_item.event_id,
          auto_id: auto_item.id
        })
        db_item.save()
          .then((res) => {
            cb(null, 'confirm')
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

module.exports.del = function(id, cb) {
  Control_auto.destroy({
    where: {
      id: id
    }
  }).then((control) => {
    cb(null, '删除成功!')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.addAuto = function(reqObj, cb) {
  let db_item = Control_auto.build({
    control_time: reqObj.time,
    control_range: reqObj.range,
    control_operation: reqObj.operation,
    control_descript: reqObj.descript,
    control_number: reqObj.number,
    sample_type: reqObj.type,
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

module.exports._update = function(reqObj, cb) {
  console.log(reqObj.id)
  Control_auto.update(
    {
      control_time: reqObj.time,
      control_range: reqObj.range,
      control_operation: reqObj.operation,
      control_descript: reqObj.descript,
      control_number: reqObj.number,
      sample_type: reqObj.sample_type,
      event_id: reqObj.eventId,
    },
    {
      where: {
        id: reqObj.id
      }
    }
  ).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}
