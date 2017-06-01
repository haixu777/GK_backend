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
              id: keyword.id,
              name: keyword.name
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
