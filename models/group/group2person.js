const Sequelize = require('sequelize')
const db = require('../../config/database')

const group2person = db.define('group2person', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  person_id: {
    type: Sequelize.INTEGER
  },
  group_id: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = group2person
