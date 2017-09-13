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

module.exports.getList = function(conditionObj, cb) {
  // conditionObj.currentPage--
  handleAccount.findAndCountAll({
    // limit: conditionObj.perItem,
    // offset: conditionObj.currentPage * conditionObj.perItem,
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
