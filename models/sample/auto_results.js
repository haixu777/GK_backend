const Sequelize = require('sequelize')
const db = require('../../config/database')

const Sample_auto = db.define('samples_auto', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  path: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

module.exports = Sample_auto

module.exports.upload = function(sample, cb) {
  let db_sample = Sample_auto.build({
    name: sample.name,
    path: sample.path
  })
  db_sample.save().then((res) => {
    cb(null, `样本：${sample.name}，添加成功!`)
  }).catch((err) => {
    cb(err, false)
  })
}
