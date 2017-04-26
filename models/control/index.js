const Sequelize = require('sequelize')
const db = require('../../config/database')

const Control = db.define('control_programs', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  control_time: Sequelize.TIME,
  control_range: Sequelize.STRING,
  control_operation: Sequelize.STRING,
  control_descript: Sequelize.STRING,
  control_number: Sequelize.INTEGER,
  sample_type: Sequelize.STRING,
  event_id: Sequelize.INTEGER
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

module.exports = Control

module.exports.getControlByEvent = function(eventId, cb) {
  Control.findAll({
    where: {
      event_id: eventId
    }
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}
