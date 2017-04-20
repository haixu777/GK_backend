const Sequelize = require('sequelize')
const db = require('../../config/database')

const Topic_1 = db.define('topic1', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  name: Sequelize.STRING,
  descript: Sequelize.STRING,
  harm_level: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = Topic_1

module.exports.updateTopic = function(body, cb) {
  Topic_1.update(
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
  ).then((topic1) => {
    cb(null, topic1)
  }).catch((err) => {
    cb(err, false)
  })
}
