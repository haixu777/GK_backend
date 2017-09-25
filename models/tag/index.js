const Sequelize = require('sequelize')
const db = require('../../config/database')

// const Events = require('../events')
const EventsTag = require('./eventsTag')

const Tag = db.define('tag', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  user_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Tag

module.exports.test = function(name, cb) {
  Tag.findOne({
    where: {
      name: name
    }
  }).then((tag) => {
    tag.getEvents().then((events) => {
      cb(null, events)
    }).catch((err) => {
      cb(err, false)
    })
  })
}

module.exports.bind = function(userId, eventId, tagName, cb) {
  Tag.findOne({
    where: {
      user_id: userId,
      name: tagName,
    }
  }).then((tag) => {
    if (tag) {//与事件绑定
      // 查看是否重复绑定
      EventsTag.findOne({
        where: {
          event_id: eventId,
          tag_id: tag.id
        }
      }).then((event_tag) => {
        if (event_tag) {
          cb('重复绑定', false)
        } else {
          let db = EventsTag.build({
            event_id: eventId,
            tag_id: tag.id
          })
          db.save().then((msg) => {
            cb(null, '绑定成功！')
          }).catch((err) => {
            cb(err, false)
          })
        }
      })
    } else {//添加Tag
      let db_tag = Tag.build({
        name: tagName,
        user_id: userId
      })
      db_tag.save().then((add_tag) => {//1. tag添加成功
        let db = EventsTag.build({
          event_id: eventId,
          tag_id: add_tag.id
        })
        db.save().then((msg) => {//2. 与事件绑定
          cb(null, '绑定成功！')
        }).catch((err) => {
          cb(err, false)
        })
      }).catch((err) => {
        cb(err, false)
      })
    }
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.unbind = function(tagId, eventId, userId, cb) {
  EventsTag.findOne({
    where: {
      tag_id: tagId,
      event_id: eventId
    }
  }).then((_eventTag) => {
    if (_eventTag) { //解绑
      _eventTag.destroy().then(() => {
        EventsTag.findOne({// 检查是否还有该tag的其他绑定, 如果没有则删除该tag
          where: {
            tag_id: tagId
          }
        }).then((hasBind) => {
          if (!hasBind) {// 删除tag
            Tag.findOne({
              where: {
                id: tagId
              }
            }).then((tag) => {
              tag.destroy().then((msg) => {
                cb(null, '解绑成功')
              }).catch((err) => {
                cb(err, false)
              })
            }).catch((err) => {
              cb(err, false)
            })
          } else {// 还有其他绑定，tag无需删除
            cb(null, '解绑成功')
          }
        }).catch((err) => {
          cb(err, null)
        })
      }).catch((err) => {
        cb(err, null)
      })
    }
  }).catch((err) => {
    cb(err, null)
  })
}

/*
module.exports.fetchByEventId = function(eventID, cb) {
  Events.findOne({
    where: {
      id: eventID
    },
    required: true
  }).then((events) => {
    let trigger = false
    for (let prop in events) {
      if (prop === 'getPlatform') {
        trigger = true
      }
    }

    if (trigger) {
      events.getPlatform().then((platformList) => {
        let resObj = platformList.map((platform) => {
          return Object.assign(
            {},
            {
              id: platform.id,
              name: platform.name,
              location: platform.location,
              parent_org: platform.parent_org,
              political: platform.political,
              influence: platform.influence,
              comment: platform.comment
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
*/
