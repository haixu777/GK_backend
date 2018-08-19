const Sequelize = require('sequelize')
const db = require('../../config/database')

const handleAccount = db.define('account_handle', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  platform: Sequelize.STRING,
  operation: Sequelize.STRING
}, {
  freezeTableName: true,
  underscored: true
})

module.exports = handleAccount

module.exports.getPlatformList = function(cb) {
  handleAccount.findAll({
    where: {
    },
    attributes: [Sequelize.fn('DISTINCT', Sequelize.col('platform')), 'platform'],
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getActionList = function(cb) {
  handleAccount.findAll({
    where: {
    },
    attributes: [Sequelize.fn('DISTINCT', Sequelize.col('operation')), 'operation'],
  }).then((res) => {
    cb(null, res)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getList = function(conditionObj, cb) {
  conditionObj.currentPage--
  handleAccount.findAndCountAll({
    limit: Number(conditionObj.perItem),
    offset: conditionObj.currentPage * Number(conditionObj.perItem),
    where: {
      platform: conditionObj.platform ? conditionObj.platform : { $ne: null },
      operation: conditionObj.operation ? conditionObj.operation : { $ne: '99' },
      name: conditionObj.name ? { $like: '%'+conditionObj.name+'%' } : { $ne: 99 }
    }
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        accountList: res.rows.map((item) => {
          return Object.assign(
            {},
            {
              id: item.id,
              name: item.name,
              platform: item.platform,
              operation: item.operation
            }
          )
        }),
        totalItem: res.count
      }
    )
    cb(null, resObj)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.handleDel = function(id, cb) {
  handleAccount.destroy({
    where: {
      id: id
    }
  }).then((msg) => {
    cb(null, '标签删除成功!')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.handleUpdate = function(reqObj, cb) {
  handleAccount.update(
    {
      name: reqObj.name,
      platform: reqObj.platform,
      operation: reqObj.operation
    },
    {
      where: {
        id: reqObj.id
      }
    }
  ).then((res) => {
    cb(null, '账号: ' + reqObj.name + ', 更新成功！')
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.handleAdd = function(reqObj, cb) {
  let db = handleAccount.build({
    name: reqObj.name,
    platform: reqObj.platform,
    operation: reqObj.operation
  })
  db.save().then((res) => {
    cb(null, '账号：' + reqObj.name + '，添加成功!')
  }).catch((err) => {
    cb(err, false)
  })
}
