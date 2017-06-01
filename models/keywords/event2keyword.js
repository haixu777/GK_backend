const Sequelize = require('sequelize')
const db = require('../../config/database')

const event2keyword = db.define('event2keyword', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  event_id: Sequelize.INTEGER,
  keyword_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = event2keyword
