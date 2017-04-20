const Sequelize = require('sequelize')
const db = require('../../config/database')

const Topic_2 = db.define('topic2', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  name: Sequelize.STRING,
  descript: Sequelize.STRING,
  harm_level: Sequelize.STRING,
  topic1_id: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Topic_2

module.exports.updateTopic = function(body, cb) {
  Topic_2.update(
    {
      name: body.name,
      descript: body.descript,
      harm_level: body.harm_level
    },
    {
      where: {
        id: body.id
      }
    }
  ).then((topic2) => {
    cb(null, topic2)
  }).catch((err) => {
    cb(err, false)
  })
}
