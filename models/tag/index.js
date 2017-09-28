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
  user_id: Sequelize.INTEGER,
  dept_name: Sequelize.STRING,
  global: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Tag

module.exports.getList = function(user_id, dept_name, domain, currentPage, perItem, cb) {
  if (currentPage) {
    currentPage--
    if (domain === '全局') {
      Tag.findAndCountAll({
        limit: perItem,
        offset: currentPage * perItem,
        where: {
          global: 1,
          $or: [
            {user_id: user_id},
            {dept_name: dept_name},
            {global: 1}
          ]
        }
      }).then((tagList) => {
        const resObj = Object.assign(
          {},
          {
            itemList: tagList.rows.map((tag) => {
              return Object.assign(
                {},
                {
                  id: tag.id,
                  name: tag.name,
                  domain: formatDomain(tag)
                }
              )
            }),
            totalItem: tagList.count
          }
        )
        cb(null, resObj)
      }).catch((err) => {
        cb(err, false)
      })


    } else if (domain == '组内') {
      Tag.findAndCountAll({
        limit: perItem,
        offset: currentPage * perItem,
        where: {
          global: 0,
          dept_name: dept_name,
          $or: [
            {user_id: user_id},
            {dept_name: dept_name},
            {global: 1}
          ]
        }
      }).then((tagList) => {
        const resObj = Object.assign(
          {},
          {
            itemList: tagList.rows.map((tag) => {
              return Object.assign(
                {},
                {
                  id: tag.id,
                  name: tag.name,
                  domain: formatDomain(tag)
                }
              )
            }),
            totalItem: tagList.count
          }
        )
        cb(null, resObj)
      }).catch((err) => {
        cb(err, false)
      })


    } else if (domain == '个人') {
      Tag.findAndCountAll({
        limit: perItem,
        offset: currentPage * perItem,
        where: {
          global: 0,
          user_id: user_id,
          dept_name: '',
          $or: [
            {user_id: user_id},
            {dept_name: dept_name},
            {global: 1}
          ]
        }
      }).then((tagList) => {
        const resObj = Object.assign(
          {},
          {
            itemList: tagList.rows.map((tag) => {
              return Object.assign(
                {},
                {
                  id: tag.id,
                  name: tag.name,
                  domain: formatDomain(tag)
                }
              )
            }),
            totalItem: tagList.count
          }
        )
        cb(null, resObj)
      }).catch((err) => {
        cb(err, false)
      })
    } else {
      Tag.findAndCountAll({
        limit: perItem,
        offset: currentPage * perItem,
        where: {
          $or: [
            {user_id: user_id},
            {dept_name: dept_name},
            {global: 1}
          ]
        }
      }).then((tagList) => {
        const resObj = Object.assign(
          {},
          {
            itemList: tagList.rows.map((tag) => {
              return Object.assign(
                {},
                {
                  id: tag.id,
                  name: tag.name,
                  domain: formatDomain(tag)
                }
              )
            }),
            totalItem: tagList.count
          }
        )
        cb(null, resObj)
      }).catch((err) => {
        cb(err, false)
      })
    }
  } else {
    Tag.findAll({
      where: {
        $or: [
          {user_id: user_id},
          {dept_name: dept_name},
          {global: 1}
        ]
      }
    }).then((tagList) => {
      let resObj = tagList.map((tag) => {
        return Object.assign(
          {},
          {
            id: tag.id,
            name: tag.name,
            domain: formatDomain(tag)
          }
        )
      })
      cb(null, resObj)
    }).catch((err) => {
      cb(err, false)
    })
  }
}

module.exports.handleAdd = function(userId, deptName, name, domain, cb) {
  let db = Tag.build({
    name: name,
    user_id: userId,
    dept_name: (domain == '全局') ? NULL : ((domain == '个人') ? '' : deptName),
    global: (domain == '全局') ? 1 : 0
  })

  if (domain == '个人') {
    Tag.findOne({//检查是否重复添加
      where: {
        user_id: userId,
        name: name,
        dept_name: ''
      }
    }).then((hasTag) => {
      if (hasTag) {
        cb('个人标签重复', false)
      } else {
        db.save().then(() => {
          cb(null, '标签：' + name + '，添加成功！')
        }).catch((err) => {
          cb(err, false)
        })
      }
    }).catch((err) => {
      cb(err, false)
    })
  } else if (domain == '组内') {
    Tag.findOne({//检查是否重复添加
      where: {
        name: name,
        dept_name: deptName
      }
    }).then((hasTag) => {
      if (hasTag) {
        cb('组内标签重复', false)
      } else {
        db.save().then(() => {
          cb(null, '标签：' + name + '，添加成功！')
        }).catch((err) => {
          cb(err, false)
        })
      }
    }).catch((err) => {
      cb(err, false)
    })
  } else if (domain == '全局') {
    Tag.findOne({//检查是否重复添加
      where: {
        global: 1,
        name: name
      }
    }).then((hasTag) => {
      if (hasTag) {
        cb('全局标签重复')
      } else {
        db.save().then(() => {
          cb(null, '标签：' + name + '，添加成功！')
        }).catch((err) => {
          cb(err, false)
        })
      }
    }).catch((err) => {
      cb(err, false)
    })
  }
}

module.exports.rename = function(id, name, cb) {
  Tag.update(
    {
      name: name
    },
    {
      where: {
        id: id
      }
    }
  ).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.del = function(id, cb) {
  EventsTag.destroy({
    where: {
      tag_id: id
    }
  }).then((res) => {
    Tag.destroy({
      where: {
        id: id
      }
    }).then((res) => {
      cb(null, '删除成功')
    }).catch((err) => {
      cb(err, false)
    })
  }).catch((err) => {
    cb(err, false)
  })
}

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

module.exports.bind = function(eventId, tagId, cb) {
  EventsTag.findOne({
    where: {
      event_id: eventId,
      tag_id: tagId
    }
  }).then((hasTag) => {
    if (hasTag) {
      cb(null, '绑定重复')
    } else {
      let db = EventsTag.build({
        event_id: eventId,
        tag_id: tagId
      })
      db.save().then((res) => {
        cb(null, '绑定成功')
      }).catch((err) => {
        cb(err, false)
      })
    }
  }).catch((err) => {
    cb(err, false)
  })
  /*
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
  */
}

module.exports.unbind = function(tagId, eventId, userId, cb) {
  EventsTag.destroy({
    where: {
      tag_id: tagId,
      event_id: eventId
    }
  }).then((res) => {
    cb(null, '取消关联成功！')
  }).catch((err) => {
    cb(err, false)
  })
}

function formatDomain(tag) {
  if (!tag.global) {
    if (tag.dept_name) {
      return '组内'
    } else {
      return '个人'
    }
  } else {
    return '全局'
  }
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
