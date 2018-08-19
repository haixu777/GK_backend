const Sequelize = require('sequelize')
const db = require('../../config/database')

const event2group = db.define('event2group', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  event_id: {
    type: Sequelize.INTEGER
  },
  group_id: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = event2group
