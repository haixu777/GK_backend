const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Events = require('../events')

const Taizhang = db.define('taizhang', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  time: Sequelize.DATE,
  content: Sequelize.STRING,
  event_id: Sequelize.UUID,
  target: Sequelize.STRING,
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Taizhang.belongsTo(Events)

module.exports = Taizhang

module.exports.getList = function(reqObj, cb) {
  Taizhang.findAndCountAll({
    where: {
      event_id: reqObj.event_id ? reqObj.event_id : {$ne: null}
    },
    order: [
      ['time', 'DESC']
    ],
    include: [
      {
        model: Events,
        attributes: ['name'],
        required: true
      }
    ]
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        taizhangList: res.rows.map((taizhang) => {
          return Object.assign(
            {},
            {
              id: taizhang.id,
              time: taizhang.time,
              time: $utils.formatTime(taizhang.time),
              content: taizhang.content,
              target: taizhang.target,
              event_id: taizhang.event_id,
              event: taizhang.event.name
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

module.exports.add = function(reqObj, cb) {
  let db = Taizhang.build({
    time: reqObj.time,
    content: reqObj.content,
    target: reqObj.target,
    event_id: reqObj.event_id
  })
  db.save().then((res) => {
    cb(null, '台账添加成功')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports._update = function(reqObj, cb) {
  Taizhang.update(
    {
      event_id: reqObj.event_id,
      content: reqObj.content,
      time: reqObj.time,
      target: reqObj.target
    },
    {
      where: {
        id: reqObj.id
      }
    }
  ).then(() => {
    cb(null, '台账更新成功')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.del = function(reqObj, cb) {
  Taizhang.destroy({
    where: {
      id: reqObj.id
    }
  }).then(() => {
    cb(null, '台账删除成功')
  }).catch((err) => {
    cb(err, false)
  })
}
