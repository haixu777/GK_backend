const Sequelize = require('sequelize')
const db = require('../../config/database')

const Events = require('../events')
const Event2platform = require('./event2platform')

const Platform = db.define('platform', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  parent_org: Sequelize.STRING,
  political: Sequelize.STRING,
  influence: Sequelize.STRING,
  comment: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

Events.belongsToMany(Platform, {through: Event2platform, as: 'Platform'})
Platform.belongsToMany(Events, {through: Event2platform})

module.exports = Platform

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
