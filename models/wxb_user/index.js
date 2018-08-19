const Sequelize = require('sequelize')
const db = require('../../config/database')

const Tag = require('../tag')

const Wxb_user = db.define('user_wxb', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  real_name: Sequelize.STRING,
  user_account: Sequelize.STRING,
  dept_name: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

Wxb_user.hasMany(Tag, {as: 'Tags', foreignKey: 'user_id'})

module.exports = Wxb_user

/*
module.exports.list = function(user_id, cb) {
  Wxb_user.findOne({
    where: {
      id: user_id
    }
  }).then((user) => {
    let hasTag = false
    for (let prop in user) {
      if (prop === 'getTags') {
        hasTag = true
      }
    }
    if (hasTag) {
      user.getTags().then((tagList) => {
        cb(null, tagList)
      }).catch((err) => {
        cb(err, false)
      })
    } else {
      cb(null, null)
    }
  }).catch((err) => {
    cb(err, false)
  })
}
*/
