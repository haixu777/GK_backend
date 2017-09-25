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

module.exports.getList = function(conditionObj, cb) {
  conditionObj.currentPage--
  handleAccount.findAndCountAll({
    limit: Number(conditionObj.perItem),
    offset: conditionObj.currentPage * Number(conditionObj.perItem),
    where: {
      platform: conditionObj.platform ? conditionObj.platform : { $ne: null }
    }
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        accountList: res.rows.map((item) => {
          return Object.assign(
            {},
            {
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
