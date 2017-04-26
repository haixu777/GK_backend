const Sequelize = require('sequelize')
const db = require('../../config/database')

const Sample = db.define('samples', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  forensic_date: Sequelize.TIME,
  post: Sequelize.STRING,
  url: Sequelize.STRING,
  publish_platform: Sequelize.STRING,
  publish_chanel: Sequelize.STRING,
  publish_time: Sequelize.TIME,
  publish_account: Sequelize.STRING,
  sample_title: Sequelize.STRING,
  sample_content: Sequelize.STRING,
  sample_path: Sequelize.STRING,
  sample_format: Sequelize.STRING,
  event_id: Sequelize.UUID
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

module.exports = Sample

module.exports.getSampleByEvent = function(eventId, cb) {
  Sample.findAll({
    where: {
      event_id: eventId
    }
  }).then((sampleList) => {
    cb(null, sampleList)
  }).catch((err) => {
    cb(err, false)
  })
}
