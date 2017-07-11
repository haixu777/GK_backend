const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Sample_auto = db.define('samples_auto', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: Sequelize.STRING,
  path: Sequelize.STRING,
  upload_date: Sequelize.DATE
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

module.exports = Sample_auto

module.exports.getList = function(reqObj, cb) {
  reqObj.currentPage--
  Sample_auto.findAndCountAll({
    limit: reqObj.perItem,
    offset: reqObj.currentPage * reqObj.perItem,
    where: {
    },
    order: reqObj.sort_key + ' ' + reqObj.sort_order
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        sampleAutoList: res.rows.map((sample) => {
          return Object.assign(
            {},
            {
              id: sample.id,
              path: sample.path,
              name: sample.name,
              upload_date: $utils.formatTime(sample.upload_date)
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

module.exports.upload = function(sample, cb) {
  let sample_path = sample.path.split('/')
  sample_path.splice(0,1)
  let db_sample = Sample_auto.build({
    name: sample.name,
    path: sample_path.join('/')
  })
  db_sample.save().then((res) => {
    cb(null, sample.name)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.del = function(id, cb) {
  Sample_auto.destroy({
    where: {
      id: id
    }
  }).then(() => {
    cb(null, '删除成功!')
  }).catch((err) => {
    cb(err, '删除失败')
  })
}

module.exports.isExist = function(filename, cb) {
  Sample_auto.findAndCountAll({
    where: {
      name: filename
    }
  }).then((res) => {
    let isExist = Boolean(res.count)
    cb(null, isExist)
  }).catch((err) => {
    cb(err, false)
  })
}
