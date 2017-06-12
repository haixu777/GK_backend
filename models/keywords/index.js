const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Events = require('../events')
const Event2Keyword = require('./event2keyword')

const Keywords = db.define('keywords', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

Events.belongsToMany(Keywords, {through: 'event2keyword', as: 'Keywords'})
Keywords.belongsToMany(Events, {through: 'event2keyword'})

module.exports = Keywords

module.exports.fetchByEventId = function(eventID, cb) {
  Events.findOne({
    where: {
      id: eventID
    },
    required: true
  }).then((events) => {
    let trigger = false
    for (let prop in events) {
      if (prop === 'getKeywords') {
        trigger = true
      }
    }

    if (trigger) {
      events.getKeywords().then((keywordsList) => {
        let resObj = keywordsList.map((keyword) => {
          return Object.assign(
            {},
            {
              value: keyword.id,
              label: keyword.name
            }
          )
        })
        cb(null, resObj)
      })
    } else {
      cb(null, [])
    }

  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getList = function (word, eventId, cb) {
  Keywords.findAll({
    where: {
      name: {
        $like: `%${word}%`
      }
    }
  }).then((keywordsList) => {
    if (keywordsList.length === 0) {
      return cb(null, null)
    }
    let resObj = []
    keywordsList.forEach((keyword, index) => {
      keyword.hasEvent(eventId).then((hasEvent) => {
        resObj.push({
          value: keyword.id,
          label: keyword.name,
          disabled: hasEvent
        })
        if (resObj.length === keywordsList.length) {
          cb(null, resObj)
        }
      })
    })
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.event2keyword = function (reqObj, cb) {
  if (reqObj.action === 'add') {
    if (reqObj.keywordId) {
      let db_e2k = Event2Keyword.build({
        keyword_id: reqObj.keywordId,
        event_id: reqObj.eventId
      })
      db_e2k.save().then((res) => {
        cb(null, `配置成功!`)
      }).catch((err) => {
        cb(err, false)
      })
    } else {
      Keywords.findOne({
        where: {
          name: reqObj.keyword
        }
      }).then((db_keyword) => {
        if (db_keyword) {
          let db_e2k = Event2Keyword.build({
            keyword_id: db_keyword.id,
            event_id: reqObj.eventId
          })
          db_e2k.save().then((res) => {
            cb(null, `配置成功!`)
          }).catch((err) => {
            cb(err, false)
          })
        } else {
          let db_keyword = Keywords.build({
            name: reqObj.keyword
          })
          db_keyword.save().then((keyword) => {
            let db_e2k = Event2Keyword.build({
              keyword_id: keyword.null,
              event_id: reqObj.eventId
            })
            db_e2k.save().then((res) => {
              cb(null, `配置成功!`)
            }).catch((err) => {
              cb(err, false)
            })
          }).catch((err) => {
            cb(err, false)
          })
        }
      })
    }
  } else if (reqObj.action === 'del') {
    Event2Keyword.findOne({
      where: {
        event_id: reqObj.eventId,
        keyword_id: reqObj.keywordId
      }
    }).then((db) => {
      db.destroy().then((info) => {
        cb(null, '删除成功')
      }).catch((err) => {
        cb(err, false)
      })
    }).catch((err) => {
      cb(err, false)
    })
  }
}
