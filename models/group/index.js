const Sequelize = require('sequelize')
const db = require('../../config/database')

const Events = require('../events')
const Event2Group = require('./event2group')

const Group = db.define('group', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  underscored: true
})

Events.belongsToMany(Group, {through: Event2Group, as: 'Group'})
Group.belongsToMany(Events, {through: Event2Group})

module.exports = Group

module.exports.fetchByEventId = function(eventID, cb) {
  Events.findOne({
    where: {
      id: eventID
    },
    required: true
  }).then((events) => {
    let trigger = false
    for (let prop in events) {
      if (prop === 'getGroup') {
        trigger = true
      }
    }

    if (trigger) {
      events.getGroup().then((groupList) => {
        let resObj = groupList.map((group) => {
          return Object.assign(
            {},
            {
              id: group.id,
              name: group.name
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
