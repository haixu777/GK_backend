const Sequelize = require('sequelize')
const db = require('../../config/database')

const Event2account = db.define('event2account', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  event_id: Sequelize.INTEGER,
  account_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Event2account
