const Sequelize = require('sequelize')
const db = require('../../config/database')

const Event2person = db.define('event2person', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  event_id: Sequelize.INTEGER,
  person_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Event2person
