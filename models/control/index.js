const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Events = require('../events')

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
  event_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Control.belongsTo(Events)

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
              event_id: item.event_id
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
      sample_type: control_item.sample_type,
      event_id: control_item.eventId
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
