const Sequelize = require('sequelize')
const db = require('../../config/database')

const Event2platform = db.define('event2platform', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  event_id: Sequelize.INTEGER,
  platform_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Event2platform
