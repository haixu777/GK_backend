const Sequelize = require('sequelize')
require('sequelize-hierarchy')(Sequelize)
const config = require('./')

const db = module.exports = new Sequelize(config.database_url, {
  define: {
    freezeTableName: true,
    timestamps: false
  }
})
