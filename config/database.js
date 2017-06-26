const Sequelize = require('sequelize')
require('sequelize-hierarchy')(Sequelize)
const config = require('./')

const db = module.exports = new Sequelize(config.database_url, {
  timezone : "+08:00",
  define: {
    freezeTableName: true,
    timestamps: false
  }
})
