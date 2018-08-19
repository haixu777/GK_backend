const Sequelize = require('sequelize')
const db = require('../../config/database')

const EventsTag = db.define('eventsTag', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  event_id: Sequelize.INTEGER,
  tag_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = EventsTag
