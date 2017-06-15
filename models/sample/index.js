const Sequelize = require('sequelize')
const db = require('../../config/database')
const $utils = require('../../utils')

const Events = require('../events')

const Sample = db.define('samples', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true
  },
  forensic_date: Sequelize.DATE,
  post: Sequelize.STRING,
  url: Sequelize.STRING,
  publish_platform: Sequelize.STRING,
  publish_chanel: Sequelize.STRING,
  publish_time: Sequelize.DATE,
  publish_account: Sequelize.STRING,
  sample_title: Sequelize.STRING,
  sample_content: Sequelize.STRING,
  sample_path: Sequelize.STRING,
  sample_format: Sequelize.STRING,
  event_id: Sequelize.UUID
}, {
  freezeTableName: true,
  underscored: true
  // hierarchy: true
})

Sample.belongsTo(Events)

module.exports = Sample

module.exports.getSampleByEvent = function(eventId, cb) {
  Sample.findAll({
    where: {
      event_id: eventId
    }
  }).then((sampleList) => {
    cb(null, sampleList)
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.getList = function(reqObj, cb) {
  reqObj.currentPage--
  Sample.findAndCountAll({
    limit: reqObj.perItem,
    offset: reqObj.currentPage * reqObj.perItem,
    where: {
      event_id: reqObj.eventId ? reqObj.eventId : { $ne: null },
    },
    include: {
      model: Events,
      attributes: ['name'],
      required: true
    },
    order: reqObj.sort_key + ' ' + reqObj.sort_order
  }).then((res) => {
    const resObj = Object.assign(
      {},
      {
        sampleList: res.rows.map((sample) => {
          return Object.assign(
            {},
            {
              forensic_date: $utils.formatTime(sample.forensic_date),
              id: sample.id,
              post: sample.post,
              publish_account: sample.publish_account,
              publish_chanel: sample.publish_chanel,
              publish_platform: sample.publish_platform,
              publish_time: sample.publish_time,
              sample_content: sample.sample_content,
              sample_format: sample.sample_format,
              sample_path: sample.sample_path,
              sample_title: sample.sample_title,
              url: sample.url,
              event_name: sample.event.name,
              event_id: sample.event_id
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

module.exports.updateSample = function(reqObj, cb) {
  Sample.update(
    {
      event_id: reqObj.event_id,
      forensic_date: reqObj.forensic_date,
      post: reqObj.post,
      publish_account: reqObj.publish_account,
      publish_chanel: reqObj.publish_chanel,
      publish_platform: reqObj.publish_platform,
      publish_time: reqObj.publish_time,
      sample_content: reqObj.sample_content,
      sample_format: reqObj.sample_format,
      sample_path: reqObj.sample_path,
      sample_title: reqObj.sample_title,
      url: reqObj.url
    },
    {
      where: {
        id: reqObj.id
      }
    }
  ).then(() => {
    cb(null, ('update sample success! id: ' + reqObj.id))
  }).catch((err) => {
    cb(err, false)
  })
}

module.exports.del = function(sample_id, cb) {
  Sample.destroy({
    where: {
      id: sample_id
    }
  }).then(() => {
    cb(null, '删除成功!')
  }).catch((err) => {
    cb(err, false)
  })
}
