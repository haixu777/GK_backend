const Sequelize = require('sequelize')
const db = require('../../config/database')

const Events = require('../events')

const User_wxb = db.define('user_wxb_sjzl', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  real_name: Sequelize.STRING,
  user_account: Sequelize.STRING,
  dept_id: Sequelize.INTEGER,
  dept_name: Sequelize.STRING,
  auth: Sequelize.INTEGER,
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = User_wxb


module.exports.userSync = function(item, cb) {
  User_wxb.findOne({
    where: {
      id: item.id
    }
  }).then((user) => {
    let formattAuth = null
    if (item.auth == '管理员') {
      formattAuth = 1
    } else if (item.auth == '高级用户') {
      formattAuth = 2
    } else {
      formattAuth = 3
    }
    if (user) {
      user.update({
        real_name: item.real_name,
        user_account: item.user_account,
        dept_id: item.dept_id || 0,
        dept_name: item.dept_name,
        auth: formattAuth
      }).then(() => {
        cb(null, '用户：' + item.real_name + '，同步成功！')
      }).catch((err) => {
        cb(err, false)
      })
    } else {
      let db_user = User_wxb.build({
        id: item.id,
        real_name: item.real_name,
        user_account: item.user_account,
        dept_id: item.dept_id || 0,
        dept_name: item.dept_name,
        auth: formattAuth
      })

      db_user.save().then(() => {
        cb(null, '用户: ' + item.real_name + '，保存成功!')
      }).catch((err) => {
        cb(err, false)
      })
    }
  }).catch((err) => {
    cb(err, false)
  })
}
