const Sequelize = require('sequelize')
const db = require('../../config/database')

const Events = require('../events')
const Event2account = require('./event2account')

const Account = db.define('account', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  site: Sequelize.STRING,
  person_id: Sequelize.INTEGER,
  group_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

Events.belongsToMany(Account, {through: Event2account, as: 'Account'})
Account.belongsToMany(Events, {through: Event2account})

module.exports = Account

module.exports.fetchByEventId = function(eventID, cb) {
  Events.findOne({
    where: {
      id: eventID
    },
    required: true
  }).then((events) => {
    let trigger = false
    for (let prop in events) {
      if (prop === 'getAccount') {
        trigger = true
      }
    }

    if (trigger) {
      events.getAccount().then((accountList) => {
        let resObj = accountList.map((account) => {
          return Object.assign(
            {},
            {
              id: account.id,
              name: account.name,
              site: account.site,
              person_id: account.person_id,
              group_id: account.group_id
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
