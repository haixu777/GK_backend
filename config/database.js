const Sequelize = require('sequelize')
const config = require('./')

const db = module.exports = new Sequelize(config.database_url, {
  define: {
    freezeTableName: true,
    timestamps: false
  }
})
